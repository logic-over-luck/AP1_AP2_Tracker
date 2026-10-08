// Probeprüfung AP1 – eigene Aufgaben, fiktive Firma (Format: ../../README.md)

// ---------- Hilfen für die Diagramme (Knoten über den Mittelpunkt setzen) ----------
const GROESSE = { start: [20, 20], ende: [24, 24], aktion: [130, 40], entscheidung: [28, 28] };
const um = (k, cx, cy) => {
  const [sw, sh] = GROESSE[k.typ] ?? [k.w, k.h];
  const w = k.w ?? sw;
  const h = k.h ?? sh;
  return { ...k, x: cx - w / 2, y: cy - h / 2 };
};
const start = (id, cx, cy) => um({ id, typ: 'start' }, cx, cy);
const ende = (id, cx, cy) => um({ id, typ: 'ende' }, cx, cy);
const akt = (id, cx, cy, text, w = 150) => um({ id, typ: 'aktion', text, w }, cx, cy);
const raute = (id, cx, cy) => um({ id, typ: 'entscheidung' }, cx, cy);
const balken = (id, cx, cy, w) => um({ id, typ: 'balken', w, h: 7 }, cx, cy);
const fl = (von, nach, extra) => ({ von, nach, typ: 'fluss', ...extra });

const breiteAttr = (t) => Math.max(84, Math.ceil(String(t).length * 7.9 + 22));
const ent = (id, x, y, text) => ({ id, typ: 'entitaet', x, y, text });
const bez = (id, x, y, text) => ({ id, typ: 'beziehung', x, y, text });
const att = (id, x, y, text, extra = {}) => ({ id, typ: 'attribut', x, y, w: breiteAttr(text), text, ...extra });
const lin = (von, nach, extra = {}) => ({ von, nach, typ: 'linie', ...extra });

// Aktivitätsdiagramm Reparaturannahme – vorgegebener Anfang
const ablaufAnfangKnoten = [
  start('s', 250, 26),
  akt('annehmen', 250, 80, 'Fahrrad annehmen', 160),
  raute('d1', 250, 140),
  akt('anlegen', 450, 140, 'Kunde anlegen', 140),
  raute('m1', 250, 200),
  akt('pruefen', 250, 260, 'Fahrrad prüfen', 160),
  akt('kva', 250, 325, 'Kostenvoranschlag erstellen', 200),
];
const ablaufAnfangKanten = [
  fl('s', 'annehmen'),
  fl('annehmen', 'd1'),
  fl('d1', 'anlegen', { text: '[Neukunde]' }),
  fl('anlegen', 'm1', { vonSeite: 'unten', via: [[450, 200]], nachSeite: 'rechts' }),
  fl('d1', 'm1', { text: '[Bestandskunde]', textSeite: -1 }),
  fl('m1', 'pruefen'),
  fl('pruefen', 'kva'),
];

const ablaufVorgabe = { breite: 600, hoehe: 360, knoten: ablaufAnfangKnoten, kanten: ablaufAnfangKanten };

const ablaufLoesung = {
  breite: 800,
  hoehe: 900,
  knoten: [
    ...ablaufAnfangKnoten,
    raute('d2', 250, 395),
    akt('zust', 480, 395, 'Zustimmung des Kunden einholen', 200),
    raute('d3', 480, 460),
    akt('rueck', 690, 460, 'Fahrrad unrepariert zurückgeben', 180),
    ende('e1', 690, 525),
    raute('m2', 250, 525),
    balken('teil', 250, 580, 320),
    akt('res', 155, 640, 'Ersatzteile reservieren', 170),
    akt('termin', 345, 640, 'Werkstatttermin eintragen', 170),
    balken('sync', 250, 700, 320),
    akt('rep', 250, 755, 'Fahrrad reparieren', 170),
    akt('sms', 250, 815, 'Kunden per SMS benachrichtigen', 230),
    ende('e2', 250, 875),
  ],
  kanten: [
    ...ablaufAnfangKanten,
    fl('kva', 'd2'),
    fl('d2', 'zust', { text: '[Betrag > 150 €]' }),
    fl('d2', 'm2', { text: '[Betrag <= 150 €]', textSeite: -1 }),
    fl('zust', 'd3'),
    fl('d3', 'rueck', { text: '[abgelehnt]' }),
    fl('rueck', 'e1'),
    fl('d3', 'm2', { vonSeite: 'unten', via: [[480, 525]], nachSeite: 'rechts', text: '[zugestimmt]' }),
    fl('m2', 'teil', { nachSeite: 'oben' }),
    fl('teil', 'res', { vonSeite: 'unten:-95', nachSeite: 'oben' }),
    fl('teil', 'termin', { vonSeite: 'unten:95', nachSeite: 'oben' }),
    fl('res', 'sync', { vonSeite: 'unten', nachSeite: 'oben:-95' }),
    fl('termin', 'sync', { vonSeite: 'unten', nachSeite: 'oben:95' }),
    fl('sync', 'rep', { vonSeite: 'unten', nachSeite: 'oben' }),
    fl('rep', 'sms'),
    fl('sms', 'e2'),
  ],
};

// ER-Modell Werkstatt – vorgegebener Anfang
const erAnfangKnoten = [
  ent('kunde', 30, 150, 'Kunde'),
  bez('besitzt', 220, 145, 'besitzt'),
  ent('rad', 400, 150, 'Fahrrad'),
  att('knr', 10, 50, 'KundenNr', { pk: true }),
  att('kname', 130, 50, 'Name'),
  att('kmail', 40, 250, 'E-Mail'),
  att('rnr', 330, 50, 'Rahmennummer', { pk: true }),
  att('marke', 470, 50, 'Marke'),
  att('modell', 430, 250, 'Modell'),
];
const erAnfangKanten = [
  lin('kunde', 'besitzt', { textVon: '1' }),
  lin('besitzt', 'rad', { textNach: 'n' }),
  lin('knr', 'kunde'),
  lin('kname', 'kunde'),
  lin('kmail', 'kunde'),
  lin('rnr', 'rad'),
  lin('marke', 'rad'),
  lin('modell', 'rad'),
];
const erVorgabe = { breite: 600, hoehe: 300, knoten: erAnfangKnoten, kanten: erAnfangKanten };
const erLoesung = {
  breite: 1020,
  hoehe: 560,
  knoten: [
    ...erAnfangKnoten,
    bez('betrifft', 590, 145, 'betrifft'),
    ent('auftrag', 770, 150, 'Reparaturauftrag'),
    att('anr', 680, 50, 'AuftragNr', { pk: true }),
    att('adatum', 800, 50, 'Annahmedatum'),
    att('status', 920, 150, 'Status'),
    bez('verbaut', 775, 290, 'verbaut'),
    att('menge', 910, 300, 'Menge'),
    ent('teil', 770, 420, 'Ersatzteil'),
    att('artnr', 600, 500, 'ArtikelNr', { pk: true }),
    att('bezeichnung', 750, 510, 'Bezeichnung'),
    att('preis', 900, 500, 'Preis'),
  ],
  kanten: [
    ...erAnfangKanten,
    lin('rad', 'betrifft', { textVon: '1' }),
    lin('betrifft', 'auftrag', { textNach: 'n' }),
    lin('anr', 'auftrag'),
    lin('adatum', 'auftrag'),
    lin('status', 'auftrag'),
    lin('auftrag', 'verbaut', { textVon: 'm' }),
    lin('verbaut', 'teil', { textNach: 'n' }),
    lin('menge', 'verbaut'),
    lin('artnr', 'teil'),
    lin('bezeichnung', 'teil'),
    lin('preis', 'teil'),
  ],
};


export default {
  id: 'ap1-02',
  teil: 'AP1',
  titel: 'Radwerk Sommerfeld',
  situation:
    'Sie sind Auszubildende bzw. Auszubildender der **Fernblick IT-Systeme GmbH**, eines Systemhauses, das kleine und mittlere Unternehmen betreut. Ihr Kunde ist die **Radwerk Sommerfeld GmbH**, ein Fahrradfachhändler mit 38 Mitarbeitenden. Das Radwerk hat drei Filialen: die Hauptfiliale in Kassel mit der großen Werkstatt und dem Versandlager für den Onlineshop sowie zwei kleinere Filialen in Göttingen und Fulda mit je einer Schnellwerkstatt.\n\nBis zum Saisonstart im Frühjahr will Geschäftsführerin Jana Sommerfeld die IT erneuern: Kassen- und Warenwirtschaftssystem werden ausgetauscht, wegen mehrerer E-Bike-Diebstähle kommt eine Videoüberwachung hinzu, die Filialnetze werden neu aufgebaut und für die Werkstätten entsteht eine Tablet-App zur Reparaturannahme.\n\nSie unterstützen Ihr Team bei folgenden Aufgaben:\n- 1. Die IT-Erneuerung planen\n- 2. Videoüberwachung und Arbeitsplätze ausstatten\n- 3. Die Filialnetze einrichten\n- 4. Die Werkstatt-App entwickeln',
  aufgaben: [
    // ---------------------------------------------------------------- Aufgabe 1
    {
      id: 'ap1-02-1',
      art: 'projekt',
      titel: 'Die IT-Erneuerung planen',
      punkte: 25,
      sp: ['AP1-1-2-2'],
      situation:
        'Für die IT-Erneuerung steht ein Budget von 85.000 € bereit. Alle Arbeiten in den Filialen müssen bis zum 1. März abgeschlossen sein. Beteiligt sind Ihr Systemhaus, ein Elektrobetrieb, der Anbieter der Kassensoftware und die drei Filialleitungen. Das Radwerk hat ein solches Vorhaben noch nie durchgeführt.',
      teile: [
        {
          nr: 'a',
          punkte: 3,
          sp: ['AP1-1-1-1'],
          text: 'Frau Sommerfeld fragt, warum Sie die IT-Erneuerung als Projekt planen und nicht „nebenbei“ erledigen. Nennen Sie drei Merkmale eines Projekts und belegen Sie jedes Merkmal mit einem Beispiel aus der Situation.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '- **Einmaligkeit/Neuartigkeit:** Das Radwerk hat ein solches Vorhaben noch nie durchgeführt.\n- **zeitliche Begrenzung:** fester Endtermin 1. März (Saisonstart)\n- **begrenzte Mittel:** Budget von 85.000 €\n- **klares Ziel:** neue Kassen, Videoüberwachung, neue Netze und Werkstatt-App\n- **mehrere Beteiligte, eigene Projektorganisation:** Systemhaus, Elektrobetrieb, Softwareanbieter, Filialleitungen\n- **Komplexität und Risiko:** drei Standorte, viele Teilaufgaben, die voneinander abhängen\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je Merkmal mit passendem Beispiel aus der Situation 1 P (max. 3)', 'Merkmal ohne Bezug zur Situation: 0,5 P'],
        },
        {
          nr: 'ba',
          punkte: 8,
          sp: ['AP1-1-2-2'],
          text: 'Für die Arbeiten in der Hauptfiliale hat Ihr Team die folgende Vorgangsliste erstellt. Die Zeitangaben sind Arbeitstage, das Projekt beginnt zum Zeitpunkt 0.\n\nVervollständigen Sie die Tabelle mit den Werten des Netzplans und geben Sie die Projektdauer an. Die Zeile für Vorgang A ist als Beispiel vorgegeben.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Vorgangsliste Hauptfiliale',
                kopf: ['Vorgang', 'Beschreibung', 'Dauer (Tage)', 'Vorgänger'],
                zeilen: [
                  ['A', 'Ist-Aufnahme und Feinplanung', '4', '–'],
                  ['B', 'Hardware bestellen und Lieferung abwarten', '8', 'A'],
                  ['C', 'Warenwirtschaft einrichten, Artikeldaten übernehmen', '6', 'A'],
                  ['D', 'Netzwerkkabel verlegen, Switches montieren', '5', 'B'],
                  ['E', 'Kameras montieren', '3', 'B'],
                  ['F', 'Kassenarbeitsplätze installieren', '3', 'C, D'],
                  ['G', 'Videorekorder und Kameras konfigurieren', '2', 'D, E'],
                  ['H', 'Abnahme und Einweisung der Mitarbeitenden', '2', 'F, G'],
                ],
              },
            },
            {
              hinweis:
                'FAZ = größter FEZ aller Vorgänger (ohne Vorgänger: 0); FEZ = FAZ + Dauer\nSEZ = kleinster SAZ aller Nachfolger (letzter Vorgang: SEZ = FEZ); SAZ = SEZ − Dauer\nGesamtpuffer GP = SAZ − FAZ; freier Puffer FP = kleinster FAZ aller Nachfolger − FEZ',
            },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['Vorgang', 'Dauer', 'FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'],
            zeilen: [
              ['A', '4', '0', '4', '0', '4', '0', '0'],
              ['B', '8', null, null, null, null, null, null],
              ['C', '6', null, null, null, null, null, null],
              ['D', '5', null, null, null, null, null, null],
              ['E', '3', null, null, null, null, null, null],
              ['F', '3', null, null, null, null, null, null],
              ['G', '2', null, null, null, null, null, null],
              ['H', '2', null, null, null, null, null, null],
              ['Projektdauer (Tage)', null, '', '', '', '', '', ''],
            ],
          },
          loesung: [
            'Vorwärtsrechnung (FAZ/FEZ): F wartet auf C (Ende 10) **und** D (Ende 17), beginnt also bei 17. G wartet auf D (17) und E (15), beginnt bei 17. H beginnt nach F (20) und G (19) bei 20.\n\nRückwärtsrechnung (SAZ/SEZ) vom Projektende 22 aus: D muss vor F (SAZ 17) und G (SAZ 18) fertig sein, also SEZ 17. B muss vor D (SAZ 12) und E (SAZ 15) fertig sein, also SEZ 12.',
            {
              tabelle: {
                kopf: ['Vorgang', 'Dauer', 'FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'],
                zeilen: [
                  ['A', '4', '0', '4', '0', '4', '0', '0'],
                  ['B', '8', '4', '12', '4', '12', '0', '0'],
                  ['C', '6', '4', '10', '11', '17', '7', '7'],
                  ['D', '5', '12', '17', '12', '17', '0', '0'],
                  ['E', '3', '12', '15', '15', '18', '3', '2'],
                  ['F', '3', '17', '20', '17', '20', '0', '0'],
                  ['G', '2', '17', '19', '18', '20', '1', '1'],
                  ['H', '2', '20', '22', '20', '22', '0', '0'],
                ],
              },
            },
            '**Projektdauer: 22 Arbeitstage.**\n\nBeachten Sie Vorgang E: Gesamtpuffer 3 Tage (so weit lässt sich E verschieben, ohne das Projektende zu gefährden), aber nur 2 Tage freier Puffer (so weit, ohne den frühesten Beginn von G zu verschieben).',
          ],
          bewertung: ['je vollständig richtiger Zeile B bis H 1 P (max. 7)', 'Projektdauer 22 Tage: 1 P', 'Folgefehler werden ohne Abzug weitergerechnet'],
        },
        {
          nr: 'bb',
          punkte: 2,
          sp: ['AP1-1-2-2'],
          text: 'Geben Sie den kritischen Weg an und erklären Sie, was er für die Projektleitung bedeutet.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Kritischer Weg: **A → B → D → F → H** (alle Vorgänge mit Gesamtpuffer 0; 4 + 8 + 5 + 3 + 2 = 22 Tage).',
            'Bedeutung: Jede Verzögerung eines dieser Vorgänge verschiebt das Projektende um dieselbe Zeit. Die Projektleitung muss diese Vorgänge besonders eng überwachen und bei Problemen sofort gegensteuern (z. B. zusätzliches Personal, Lieferung beschleunigen).',
          ],
          bewertung: ['kritischer Weg vollständig und richtig: 1 P', 'Folgefehler aus ba) ohne Abzug', 'Bedeutung (Verzögerung verschiebt das Projektende): 1 P'],
        },
        {
          nr: 'bc',
          punkte: 2,
          sp: ['AP1-1-2-2', 'AP1-1-2-3'],
          text: 'Der Lieferant hat falsche Kamerahalterungen geschickt. Dadurch dauert Vorgang E (Kameras montieren) 4 Arbeitstage länger als geplant. Alle anderen Vorgänge laufen nach Plan.\n\nErmitteln Sie, um wie viele Tage sich das Projektende verschiebt, und die neue Projektdauer.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'versatz', label: 'Verschiebung des Projektendes', erwartet: 1, stellen: 0, einheit: 'Tage' },
              { id: 'dauer', label: 'neue Projektdauer', erwartet: 23, stellen: 0, einheit: 'Tage' },
            ],
          },
          loesung: [
            '- Vorgang E hat einen Gesamtpuffer von 3 Tagen. Eine Verzögerung von 4 Tagen übersteigt den Puffer um 4 − 3 = **1 Tag**.\n- Probe: E endet bei 12 + 7 = 19, G läuft von 19 bis 21, H kann erst bei 21 beginnen und endet bei **23**.\n- E wird damit Teil eines neuen kritischen Wegs (A → B → E → G → H).',
          ],
          bewertung: ['Verschiebung 1 Tag: 1 P', 'neue Projektdauer 23 Tage: 1 P', 'Folgefehler aus ba) ohne Abzug'],
        },
        {
          nr: 'c',
          punkte: 4,
          sp: ['AP1-1-1-2'],
          text: 'Die Installation in den Filialen plant Ihr Systemhaus nach dem Wasserfallmodell. Den neuen Onlineshop entwickelt dagegen eine Agentur agil mit Scrum in zweiwöchigen Sprints.\n\nBegründen Sie jeweils, warum das gewählte Vorgehensmodell zu diesem Teilprojekt passt.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Installation – Wasserfallmodell:** Die Anforderungen sind von Anfang an bekannt und ändern sich kaum (Anzahl Kassen, Kameras, Netzdosen). Die Arbeiten bauen fest aufeinander auf (erst Kabel, dann Switches, dann Geräte) und lassen sich in Phasen mit festen Terminen und Abnahmen planen. Der feste Endtermin und das feste Budget lassen sich so gut überwachen.',
            '**Onlineshop – Scrum:** Die Anforderungen an einen Shop sind zu Beginn oft noch unklar und ändern sich (Kundenwünsche, Wettbewerb, neue Zahlungsarten). In kurzen Sprints entsteht regelmäßig eine nutzbare Version, die das Radwerk prüfen kann. Rückmeldungen fließen schnell in die nächsten Sprints ein, Fehlentwicklungen fallen früh auf.',
            'Andere sinnvolle Begründungen sind richtig.',
          ],
          bewertung: ['je schlüssiger Begründung mit Bezug zum Teilprojekt 2 P'],
        },
        {
          nr: 'da',
          punkte: 2,
          sp: ['AP1-5-1-4', 'AP1-1-3-3'],
          text: 'Frau Sommerfeld möchte künftig auch KI-Werkzeuge nutzen. Nennen Sie zwei sinnvolle Einsatzmöglichkeiten von KI im Radwerk.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            '- Produktbeschreibungen für den Onlineshop entwerfen oder übersetzen\n- Chatbot im Onlineshop für häufige Fragen (Lieferzeit, Rahmengröße, Öffnungszeiten)\n- Bestellvorschläge und Absatzprognosen für die Saison aus den Verkaufsdaten\n- Werkstatt: Reparaturnotizen per Spracheingabe erfassen und zusammenfassen\n- Bilderkennung zur Einschätzung von Verschleißteilen (z. B. Kette, Bremsbeläge)\n- Entwürfe für Werbetexte und Social-Media-Beiträge\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je sinnvoller Einsatzmöglichkeit 1 P (max. 2)'],
        },
        {
          nr: 'db',
          punkte: 4,
          sp: ['AP1-2-3-1', 'AP1-7-5-1', 'AP1-5-1-4'],
          text: 'Eine Mitarbeiterin des Onlineshops möchte die Kundendatei (Namen, Anschriften, bisherige Käufe) in die kostenlose Version eines KI-Chatdienstes hochladen, um daraus persönliche Werbe-E-Mails erstellen zu lassen. Sie lesen dazu die Nutzungsbedingungen des Dienstes.\n\nErläutern Sie anhand des Auszugs zwei Gründe, die gegen dieses Vorgehen sprechen.',
          vorgaben: [
            {
              hinweis:
                '**Free plan – how we use your content**\n\nContent you submit, including prompts and uploaded files, may be reviewed by our staff and used to train and improve our models. Your data is processed on servers located outside the European Union and may be stored for up to 30 days. Do not upload personal data of other people unless you are legally allowed to do so. For business customers, our Team plan includes a data processing agreement and ensures that your content is never used for training.',
            },
          ],
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '- **Nutzung zum Training und Einsicht durch Personal:** Hochgeladene Daten können von Mitarbeitenden des Anbieters gelesen und zum Trainieren der Modelle verwendet werden. Kundendaten könnten so in fremde Hände gelangen oder in Antworten an andere Nutzer auftauchen – die Vertraulichkeit ist nicht gewährleistet.\n- **Personenbezogene Daten Dritter ohne Rechtsgrundlage:** Die Kundendaten sind personenbezogene Daten nach DSGVO. Für die kostenlose Version gibt es keinen Vertrag zur Auftragsverarbeitung; der Anbieter verbietet selbst das Hochladen ohne rechtliche Erlaubnis. Das Radwerk würde gegen den Datenschutz verstoßen (Bußgeld, Imageschaden).\n- **Verarbeitung außerhalb der EU und Speicherung bis 30 Tage:** Die Daten verlassen die EU und bleiben eine Zeit lang gespeichert; das Radwerk hat darauf keinen Einfluss.\n- Besser: Team-Version mit Auftragsverarbeitungsvertrag nutzen oder nur anonymisierte Daten bzw. Textvorlagen ohne Kundendaten erstellen lassen.',
          ],
          bewertung: ['je Grund mit Erläuterung und Bezug zum Text 2 P (max. 4)', 'Grund ohne Erläuterung 1 P'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 2
    {
      id: 'ap1-02-2',
      art: 'hardware',
      titel: 'Videoüberwachung und Arbeitsplätze',
      punkte: 25,
      sp: ['AP1-4-2-2'],
      situation:
        'In der Hauptfiliale werden Werkstatt, Verkaufsraum und Hof künftig mit IP-Kameras überwacht. Die Aufnahmen speichert ein Netzwerk-Videorekorder (NVR). Strom erhalten die Kameras über das Netzwerkkabel von einem PoE-Switch. Außerdem werden neue Werkstatt-Terminals und Kassenarbeitsplätze eingerichtet.',
      teile: [
        {
          nr: 'aa',
          punkte: 5,
          sp: ['AP1-4-2-2', 'AP1-4-2-1'],
          text: 'In der Hauptfiliale werden 6 Innenkameras mit einer Datenrate von je 4 Mbit/s und 2 Außenkameras mit je 6 Mbit/s installiert. Alle Kameras zeichnen rund um die Uhr auf. Die Aufnahmen werden 72 Stunden gespeichert und danach automatisch überschrieben. Für die Festplatte wird eine Reserve von 20 % eingeplant.\n\nBerechnen Sie die geforderten Werte. Rechnen Sie mit Dezimalpräfixen (1 Mbit = 10⁶ Bit, 1 MB = 10⁶ Byte, 1 GB = 10⁹ Byte, 1 TB = 10¹² Byte).',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'rate', label: 'Datenrate aller Kameras zusammen', erwartet: 36, stellen: 0, einheit: 'Mbit/s' },
              { id: 'tag', label: 'Datenmenge je Tag', erwartet: 388.8, stellen: 1, toleranz: 0.1, einheit: 'GB' },
              { id: 'frist', label: 'Speicherbedarf für 72 Stunden', erwartet: 1166.4, stellen: 1, toleranz: 0.2, einheit: 'GB' },
              { id: 'reserve', label: 'Speicherbedarf mit 20 % Reserve', erwartet: 1.39968, stellen: 2, toleranz: 0.01, einheit: 'TB' },
            ],
          },
          loesung: [
            '- Datenrate: 6 × 4 Mbit/s + 2 × 6 Mbit/s = 24 + 12 = **36 Mbit/s**\n- in Byte: 36 Mbit/s / 8 = 4,5 MB/s\n- je Tag: 4,5 MB/s × 86.400 s = 388.800 MB = **388,8 GB**\n- 72 Stunden = 3 Tage: 388,8 GB × 3 = **1.166,4 GB**\n- mit Reserve: 1.166,4 GB × 1,2 = 1.399,68 GB ≈ **1,40 TB**',
          ],
          bewertung: ['Datenrate: 1 P', 'Datenmenge je Tag (Umrechnung Bit → Byte und Sekunden je Tag): 2 P', 'Speicherbedarf 72 Stunden: 1 P', 'mit Reserve in TB: 1 P', 'Folgefehler ohne Abzug'],
        },
        {
          nr: 'ab',
          punkte: 3,
          sp: ['AP1-4-1-3'],
          text: 'Für den Videorekorder stehen Überwachungsfestplatten (HDD) mit 1 TB, 2 TB und 4 TB zur Wahl.\n\nWählen Sie die passende Festplatte aus. Begründen Sie außerdem, warum für den Videorekorder eine HDD und keine SSD vorgesehen ist. Falls Sie aa) nicht lösen konnten, rechnen Sie mit 1,4 TB.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '**Auswahl: 2 TB** – 1 TB reicht für 1,40 TB nicht aus, 4 TB wären unnötig groß und teurer.',
            '**HDD statt SSD:**\n- deutlich geringerer Preis je TB bei großen Datenmengen\n- Die Datenrate von 4,5 MB/s schafft auch eine HDD mühelos; die hohe Geschwindigkeit einer SSD bringt hier keinen Vorteil.\n- Der Rekorder schreibt ununterbrochen (rund 389 GB je Tag, etwa 142 TB je Jahr). SSDs vertragen nur eine begrenzte Schreibmenge (TBW) und würden schnell verschleißen; Überwachungs-HDDs sind für dauerndes Schreiben rund um die Uhr ausgelegt.',
          ],
          bewertung: ['Auswahl 2 TB: 1 P (Folgefehler aus aa) ohne Abzug)', 'Begründung HDD statt SSD: 2 P (z. B. Preis je TB, Dauerschreiblast/Verschleiß, Geschwindigkeit reicht)'],
        },
        {
          nr: 'ba',
          punkte: 3,
          sp: ['AP1-4-1-4', 'AP1-6-1-3'],
          text: 'Erklären Sie die Funktionsweise von Power over Ethernet (PoE) und nennen Sie zwei Vorteile für die Installation der Kameras.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '**Funktionsweise:** Der PoE-Switch (bzw. ein PoE-Injektor) überträgt über das Twisted-Pair-Netzwerkkabel neben den Daten auch die Versorgungsspannung zum Endgerät. Das Gerät braucht kein eigenes Netzteil. Der Switch prüft vorher, ob das Gerät PoE-fähig ist, und liefert nur dann Strom.',
            '**Vorteile (zwei genügen):**\n- nur ein Kabel je Kamera, keine Steckdose am Montageort (z. B. unter der Decke, am Hof) nötig\n- geringere Installationskosten, kein Elektriker für zusätzliche Stromleitungen\n- zentrale Stromversorgung: mit einer USV am Switch laufen alle Kameras bei Stromausfall weiter\n- Kameras lassen sich aus der Ferne durch Abschalten des Ports neu starten\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['Funktionsweise (Daten und Strom über dasselbe Netzwerkkabel): 1 P', 'je Vorteil 1 P (max. 2)'],
        },
        {
          nr: 'bb',
          punkte: 4,
          sp: ['AP1-4-2-3', 'AP1-4-1-4'],
          text: 'Der PoE-Switch hat 16 Ports, davon 12 PoE+-Ports nach IEEE 802.3at. Das gesamte PoE-Budget beträgt 130 W. Angeschlossen werden:\n- 6 Innenkameras mit je 5,8 W\n- 2 Außenkameras mit Heizung mit je 12,4 W\n- 3 WLAN-Access-Points mit je 16,5 W\n\nAlle Werte sind die maximale Leistungsaufnahme laut Datenblatt. Berechnen Sie den gesamten Leistungsbedarf, das verbleibende PoE-Budget und die Auslastung des Budgets in Prozent (eine Nachkommastelle).',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'gesamt', label: 'Leistungsbedarf aller Geräte', erwartet: 109.1, stellen: 1, toleranz: 0.05, einheit: 'W' },
              { id: 'rest', label: 'verbleibendes PoE-Budget', erwartet: 20.9, stellen: 1, toleranz: 0.05, einheit: 'W' },
              { id: 'quote', label: 'Auslastung des PoE-Budgets', erwartet: 83.923, stellen: 1, toleranz: 0.06, einheit: '%' },
            ],
          },
          loesung: [
            '- Innenkameras: 6 × 5,8 W = 34,8 W\n- Außenkameras: 2 × 12,4 W = 24,8 W\n- Access-Points: 3 × 16,5 W = 49,5 W\n- Summe: 34,8 W + 24,8 W + 49,5 W = **109,1 W**\n- Restbudget: 130 W − 109,1 W = **20,9 W**\n- Auslastung: 109,1 W / 130 W × 100 % ≈ **83,9 %**',
          ],
          bewertung: ['Leistungsbedarf: 2 P', 'Restbudget: 1 P', 'Auslastung: 1 P', 'Folgefehler ohne Abzug'],
        },
        {
          nr: 'bc',
          punkte: 2,
          sp: ['AP1-4-1-4', 'AP1-4-2-3'],
          text: 'Für die Hofeinfahrt soll zusätzlich eine schwenkbare Kamera mit einer maximalen Leistungsaufnahme von 24 W an einem freien PoE+-Port des Switches angeschlossen werden. Begründen Sie, ob das möglich ist, und schlagen Sie gegebenenfalls eine Lösung vor. Falls Sie bb) nicht lösen konnten, rechnen Sie mit einem Restbudget von 21 W.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            '**Nicht möglich.** Ein PoE+-Port könnte zwar bis zu 25,5 W am Endgerät liefern, das verbleibende Budget des Switches beträgt aber nur 20,9 W (< 24 W). Der Switch würde den zusätzlichen Port nicht versorgen oder bei Überlast einzelne Ports abschalten (meist nach Port-Priorität).',
            'Lösungen: Switch mit größerem PoE-Budget einsetzen, die Kamera über einen eigenen PoE-Injektor bzw. ein eigenes Netzteil versorgen oder einen Access-Point an einen anderen PoE-Switch umziehen.',
          ],
          bewertung: ['Entscheidung „nicht möglich“ mit Vergleich Restbudget und Bedarf: 1 P', 'passender Lösungsvorschlag: 1 P', 'Folgefehler aus bb) ohne Abzug'],
        },
        {
          nr: 'c',
          punkte: 4,
          sp: ['AP1-4-1-4', 'AP1-4-3-1'],
          text: 'Für die Werkstatt wurde ein Terminal mit folgenden Angaben im Datenblatt ausgewählt. Beschreiben Sie die Bedeutung jeder Angabe und ihren Nutzen in der Werkstatt. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Angabe im Datenblatt', 'Bedeutung und Nutzen in der Werkstatt'],
            zeilen: [
              ['Auflösung 1920 × 1080 Pixel', 'Full HD; Auftragsdaten und Explosionszeichnungen werden scharf dargestellt.'],
              ['Schutzart IP54', null],
              ['Leuchtdichte 400 cd/m²', null],
              ['matte, entspiegelte Bildschirmoberfläche', null],
              ['Blickwinkel 178° horizontal und vertikal', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Angabe', 'Bedeutung und Nutzen'],
                zeilen: [
                  ['Schutzart IP54', 'Schutz gegen Staub in schädigender Menge (5) und gegen Spritzwasser aus allen Richtungen (4); in der Werkstatt fallen Staub, Schmutz und Spritzer von Wasser, Öl oder Reinigern an.'],
                  ['Leuchtdichte 400 cd/m²', 'Maß für die Helligkeit des Bildschirms; das Bild bleibt auch in der hell beleuchteten Werkstatt bzw. bei Tageslicht am offenen Hallentor gut lesbar.'],
                  ['matte, entspiegelte Oberfläche', 'keine störenden Spiegelungen von Hallenlampen und Fenstern; schont die Augen (Ergonomie), weniger Ermüdung.'],
                  ['Blickwinkel 178°', 'Bild ist auch von der Seite ohne Farb- und Kontrastverlust erkennbar; Mechaniker können im Stehen oder von der Montagestelle aus ablesen, mehrere Personen sehen gleichzeitig auf das Bild.'],
                ],
              },
            },
          ],
          bewertung: ['je Zeile mit Bedeutung und passendem Nutzen 1 P'],
        },
        {
          nr: 'd',
          punkte: 4,
          sp: ['AP1-4-3-2'],
          text: 'In der Filiale Fulda beginnt ein neuer Verkäufer, der stark sehbehindert ist; er hat noch ein geringes Restsehvermögen. Nennen Sie vier Hilfsmittel oder Einstellungen, die ihm die Arbeit am Kassen- und Beratungsarbeitsplatz erleichtern.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            '- Bildschirmlupe (Vergrößerungssoftware)\n- Skalierung bzw. größere Schrift und größere Mauszeiger in den Systemeinstellungen\n- Hochkontrastmodus bzw. Farbschema mit starkem Kontrast\n- großer Monitor mit Monitorarm, der nah an die Augen gebracht werden kann\n- Screenreader (Sprachausgabe) mit Kopfhörer\n- Braillezeile für Blindenschrift\n- Tastatur mit großen, kontrastreichen Tasten bzw. tastbaren Markierungen\n- Sprachsteuerung bzw. Diktierfunktion\n- blendfreie Arbeitsplatzbeleuchtung\n- Andere sinnvolle Antworten sind richtig.',
          ],
          bewertung: ['je Hilfsmittel oder Einstellung 1 P (max. 4)'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 3
    {
      id: 'ap1-02-3',
      art: 'netzwerk',
      titel: 'Die Filialnetze einrichten',
      punkte: 25,
      sp: ['AP1-6-2-3'],
      situation:
        'Alle drei Filialen erhalten einen Glasfaseranschluss und neue Router. Der Provider stellt dem Radwerk das IPv6-Präfix **2001:db8:4a2c::/48** zur Verfügung. Intern laufen die Kassen und der Warenwirtschaftsserver weiterhin zusätzlich mit IPv4: Kassel nutzt 10.10.0.0/24, Göttingen 10.20.0.0/24 und Fulda 10.30.0.0/24. Der Warenwirtschaftsserver (10.10.0.20) und der interne DNS-Server (10.10.0.53) stehen in Kassel; die Filialen sind per VPN verbunden.',
      teile: [
        {
          nr: 'aa',
          punkte: 3,
          sp: ['AP1-6-2-3'],
          text: 'Geben Sie die IPv6-Adressen in der geforderten Schreibweise an.',
          antwort: {
            art: 'tabelle',
            kopf: ['Adresse', 'gesuchte Schreibweise', 'Ihre Lösung'],
            zeilen: [
              ['2001:0db8:4a2c:0110:0000:0000:0000:0a01', 'kürzeste Schreibweise', null],
              ['2001:0db8:4a2c:0000:0b00:0000:0000:0001', 'kürzeste Schreibweise', null],
              ['fe80::2a0:c9ff:fe14:7b', 'vollständige Schreibweise (8 Blöcke à 4 Stellen)', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Adresse', 'Lösung'],
                zeilen: [
                  ['2001:0db8:4a2c:0110:0000:0000:0000:0a01', '2001:db8:4a2c:110::a01'],
                  ['2001:0db8:4a2c:0000:0b00:0000:0000:0001', '2001:db8:4a2c:0:b00::1'],
                  ['fe80::2a0:c9ff:fe14:7b', 'fe80:0000:0000:0000:02a0:c9ff:fe14:007b'],
                ],
              },
            },
            'Regeln: Führende Nullen eines Blocks dürfen entfallen, Nullen am Ende nicht (0110 → 110, 0b00 → b00). „::“ ersetzt eine Folge von Null-Blöcken und darf nur **einmal** vorkommen – bei mehreren Folgen die längste (Zeile 2: Blöcke 6 und 7 statt Block 4). In Zeile 3 stehen fünf Blöcke, „::“ steht also für drei Null-Blöcke.',
          ],
          bewertung: ['je richtiger Zeile 1 P', 'Zeile 2 als 2001:db8:4a2c::b00:0:0:1 (gültig, aber nicht die kürzeste Form): 0,5 P'],
        },
        {
          nr: 'ab',
          punkte: 4,
          sp: ['AP1-6-2-3'],
          text: 'Ordnen Sie den Adressen den passenden Adresstyp zu. Die erste Zeile ist ein Beispiel.\n\nAuswahl: Global Unicast, Link-Local, Unique Local, Multicast, Loopback',
          antwort: {
            art: 'tabelle',
            kopf: ['IPv6-Adresse', 'Adresstyp'],
            zeilen: [
              ['::1', 'Loopback'],
              ['fe80::2a0:c9ff:fe14:7b', null],
              ['ff02::1', null],
              ['fd3e:91c2:7a10:1::20', null],
              ['2001:db8:4a2c:110::a01', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['IPv6-Adresse', 'Adresstyp', 'Erkennungsmerkmal'],
                zeilen: [
                  ['fe80::2a0:c9ff:fe14:7b', 'Link-Local', 'beginnt mit fe80::/10, nur im eigenen Netzsegment gültig'],
                  ['ff02::1', 'Multicast', 'beginnt mit ff; ff02::1 = alle Knoten im Segment'],
                  ['fd3e:91c2:7a10:1::20', 'Unique Local', 'fc00::/7 (in der Praxis fd…), privat, wird nicht ins Internet geroutet'],
                  ['2001:db8:4a2c:110::a01', 'Global Unicast', 'aus dem Präfix des Providers (2000::/3), weltweit eindeutig'],
                ],
              },
            },
            'Hinweis: 2001:db8::/32 ist in der Realität für Dokumentation und Beispiele reserviert. In dieser Aufgabe steht es für das öffentliche Präfix des Providers.',
          ],
          bewertung: ['je richtiger Zuordnung 1 P'],
        },
        {
          nr: 'ac',
          punkte: 2,
          sp: ['AP1-6-2-3', 'AP1-4-2-1'],
          text: 'Das /48-Präfix soll in Subnetze mit dem Präfix /64 aufgeteilt werden. Berechnen Sie die Anzahl der möglichen /64-Subnetze und geben Sie an, wie viele Bit für die Interface-ID bleiben.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'netze', label: 'Anzahl /64-Subnetze', erwartet: 65536, stellen: 0 },
              { id: 'bits', label: 'Bit für die Interface-ID', erwartet: 64, stellen: 0, einheit: 'Bit' },
            ],
          },
          loesung: ['- Für Subnetze stehen 64 − 48 = 16 Bit zur Verfügung: 2¹⁶ = **65.536** Subnetze.\n- IPv6-Adressen haben 128 Bit: 128 − 64 = **64 Bit** Interface-ID.'],
          bewertung: ['je richtigem Wert 1 P'],
        },
        {
          nr: 'ba',
          punkte: 4,
          sp: ['AP1-6-2-4'],
          text: 'Die Kassen-PCs erhalten ihre IPv4-Konfiguration per DHCP vom Router der Filiale. Beschreiben Sie den Ablauf der Adressvergabe, indem Sie die Tabelle vervollständigen.',
          antwort: {
            art: 'tabelle',
            kopf: ['Schritt', 'Nachricht', 'Absender → Empfänger', 'Zweck'],
            zeilen: [
              ['1', null, null, null],
              ['2', null, null, null],
              ['3', null, null, null],
              ['4', null, null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Schritt', 'Nachricht', 'Absender → Empfänger', 'Zweck'],
                zeilen: [
                  ['1', 'DHCP Discover', 'Client → alle (Broadcast)', 'Client sucht einen DHCP-Server.'],
                  ['2', 'DHCP Offer', 'Server → Client', 'Server bietet eine freie IP-Adresse mit Maske, Gateway, DNS-Server und Lease-Dauer an.'],
                  ['3', 'DHCP Request', 'Client → alle (Broadcast)', 'Client fordert das gewählte Angebot an; andere Server wissen damit, dass ihr Angebot abgelehnt ist.'],
                  ['4', 'DHCP Acknowledge (ACK)', 'Server → Client', 'Server bestätigt die Vergabe; der Client übernimmt die Konfiguration.'],
                ],
              },
            },
          ],
          bewertung: ['je vollständig richtiger Zeile (Nachricht, Richtung, Zweck) 1 P', 'Kurzformen DORA bzw. englische Bezeichnungen sind richtig'],
        },
        {
          nr: 'bb',
          punkte: 4,
          sp: ['AP1-6-3-2', 'AP1-6-2-1'],
          text: 'In der Filiale Göttingen meldet die Kassensoftware „Server wawi.radwerk.intern nicht erreichbar“. Sie führen am betroffenen Kassen-PC folgende Befehle aus. Die anderen Kassen der Filiale zeigen denselben Fehler.\n\nErmitteln Sie die Ursache des Fehlers und beschreiben Sie, wie Sie ihn dauerhaft für alle Kassen der Filiale beheben.',
          vorgaben: [
            {
              titel: 'Ausgaben am Kassen-PC (Auszug)',
              code: 'C:\\> ping 10.10.0.20\nAntwort von 10.10.0.20: Bytes=32 Zeit=11ms TTL=126\nAntwort von 10.10.0.20: Bytes=32 Zeit=10ms TTL=126\n\nC:\\> ping wawi.radwerk.intern\nPing-Anforderung konnte Host "wawi.radwerk.intern" nicht finden.\nÜberprüfen Sie den Namen, und versuchen Sie es erneut.\n\nC:\\> ipconfig /all\n   DHCP aktiviert. . . . . . . . . . : Ja\n   IPv4-Adresse  . . . . . . . . . . : 10.20.0.57(Bevorzugt)\n   Subnetzmaske  . . . . . . . . . . : 255.255.255.0\n   Standardgateway . . . . . . . . . : 10.20.0.1\n   DHCP-Server . . . . . . . . . . . : 10.20.0.1\n   DNS-Server  . . . . . . . . . . . : 10.20.0.35',
            },
          ],
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Ursache:** Der Server ist über seine IP-Adresse erreichbar – Verkabelung, IP-Konfiguration, Gateway und VPN funktionieren also. Nur die **Namensauflösung** schlägt fehl. Als DNS-Server ist 10.20.0.35 eingetragen statt des internen DNS-Servers 10.10.0.53. Da alle Kassen betroffen sind und die Adresse per DHCP kommt, ist im DHCP-Server (Router 10.20.0.1) eine falsche DNS-Server-Option hinterlegt.',
            '**Behebung:** Im DHCP-Bereich des Routers in Göttingen den DNS-Server auf 10.10.0.53 korrigieren. Danach an den Kassen die Konfiguration neu beziehen (`ipconfig /renew` bzw. Neustart) und gegebenenfalls den DNS-Cache leeren (`ipconfig /flushdns`). Kontrolle mit `nslookup wawi.radwerk.intern`.',
          ],
          bewertung: ['Ursache: Namensauflösung gestört, falscher DNS-Server: 2 P', 'dauerhafte Behebung über die DHCP-Einstellung (nicht nur an einem PC): 2 P', 'nur manuelle Änderung am einzelnen PC: 1 P'],
        },
        {
          nr: 'ca',
          punkte: 4,
          sp: ['AP1-6-1-4'],
          text: 'Für die Werkstätten werden neue WLAN-Access-Points beschafft. Vervollständigen Sie die Übersicht der WLAN-Generationen. Die erste Zeile ist ein Beispiel.',
          antwort: {
            art: 'tabelle',
            kopf: ['Bezeichnung', 'IEEE-Standard', 'Frequenzbereich(e)'],
            zeilen: [
              ['Wi-Fi 4', '802.11n', '2,4 GHz und 5 GHz'],
              ['Wi-Fi 5', null, null],
              ['Wi-Fi 6', null, null],
              ['Wi-Fi 6E', null, null],
              ['Wi-Fi 7', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Bezeichnung', 'IEEE-Standard', 'Frequenzbereich(e)'],
                zeilen: [
                  ['Wi-Fi 5', '802.11ac', '5 GHz'],
                  ['Wi-Fi 6', '802.11ax', '2,4 GHz und 5 GHz'],
                  ['Wi-Fi 6E', '802.11ax', '2,4 GHz, 5 GHz und 6 GHz'],
                  ['Wi-Fi 7', '802.11be', '2,4 GHz, 5 GHz und 6 GHz'],
                ],
              },
            },
            'Hinweis: Wi-Fi-5-Access-Points funken meist zusätzlich im 2,4-GHz-Band, dort aber nach 802.11n.',
          ],
          bewertung: ['je vollständig richtiger Zeile 1 P'],
        },
        {
          nr: 'cb',
          punkte: 4,
          sp: ['AP1-6-3-1'],
          text: 'Für das Mitarbeiter-WLAN (Tablets der Werkstatt, Notebooks der Filialleitungen) schlägt Ihr Kollege WPA3-Personal mit einem gemeinsamen Schlüssel (Pre-shared Key) vor. Ihre Ausbilderin empfiehlt WPA3-Enterprise mit Anmeldung über einen RADIUS-Server.\n\nErläutern Sie den Unterschied der beiden Verfahren und begründen Sie, welches Verfahren für das Mitarbeiter-WLAN besser geeignet ist.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Unterschied:** Bei WPA3-Personal melden sich alle Geräte mit **demselben** Schlüssel an. Bei WPA3-Enterprise (IEEE 802.1X) meldet sich jede Person bzw. jedes Gerät **einzeln** mit eigenen Zugangsdaten oder einem Zertifikat an; der Access-Point fragt einen zentralen Authentifizierungsserver (RADIUS), der den Zugang erlaubt oder ablehnt.',
            '**Empfehlung: WPA3-Enterprise.** Bei drei Filialen, wechselndem Personal und Saisonkräften müsste beim PSK nach jedem Ausscheiden der Schlüssel auf allen Geräten geändert werden; der Schlüssel kann leicht weitergegeben werden. Mit Enterprise sperrt man nur das einzelne Konto, Anmeldungen sind einer Person zuordenbar und die Zugangsdaten stammen zentral aus der Benutzerverwaltung.',
            'WPA3-Personal ist dagegen für das Kunden-WLAN im Wartebereich ausreichend.',
          ],
          bewertung: ['Unterschied (gemeinsamer Schlüssel vs. individuelle Anmeldung über RADIUS): 2 P', 'Begründung der Wahl mit Bezug zur Situation: 2 P'],
        },
      ],
    },

    // ---------------------------------------------------------------- Aufgabe 4
    {
      id: 'ap1-02-4',
      art: 'programmieren',
      titel: 'Die Werkstatt-App entwickeln',
      punkte: 25,
      sp: ['AP1-8-3-3'],
      situation:
        'Bisher werden Reparaturen auf Papier-Laufzetteln und in einer Tabellenkalkulation festgehalten. Ihr Team entwickelt eine Tablet-App, mit der die Werkstätten Reparaturaufträge annehmen, planen und abrechnen.',
      teile: [
        {
          nr: 'a',
          punkte: 7,
          sp: ['AP1-8-3-3'],
          text: 'Der Ablauf der Reparaturannahme soll als UML-Aktivitätsdiagramm dokumentiert werden. Ihre Kollegin hat den Anfang gezeichnet. Vervollständigen Sie das Diagramm nach der Aktion „Kostenvoranschlag erstellen“ gemäß folgender Beschreibung:\n- Liegt der Kostenvoranschlag über 150 €, muss der Kunde zustimmen. Dazu wird er angerufen. Lehnt er ab, wird das Fahrrad unrepariert zurückgegeben und der Ablauf endet.\n- Liegt der Betrag bei höchstens 150 € oder hat der Kunde zugestimmt, werden **gleichzeitig** die Ersatzteile im Lager reserviert und ein Termin im Werkstattplan eingetragen.\n- Erst wenn **beides** erledigt ist, wird das Fahrrad repariert. Anschließend wird der Kunde per SMS benachrichtigt; damit endet der Ablauf.',
          vorgaben: [{ titel: 'Begonnenes Aktivitätsdiagramm', diagramm: ablaufVorgabe }],
          antwort: { art: 'papier' },
          loesung: [
            { titel: 'Musterlösung', diagramm: ablaufLoesung },
            'Element für Element:\n- Entscheidung nach „Kostenvoranschlag erstellen“ mit den Bedingungen [Betrag > 150 €] und [Betrag <= 150 €] (lückenlos, ohne Überschneidung)\n- Aktion „Zustimmung des Kunden einholen“\n- zweite Entscheidung mit [abgelehnt] und [zugestimmt]\n- Aktion „Fahrrad unrepariert zurückgeben“ mit eigenem Endknoten\n- Zusammenführung (Raute) der Zweige [Betrag <= 150 €] und [zugestimmt]\n- Teilung (Balken), zwei parallele Aktionen „Ersatzteile reservieren“ und „Werkstatttermin eintragen“, Synchronisation (Balken)\n- Aktionen „Fahrrad reparieren“ und „Kunden per SMS benachrichtigen“, Endknoten',
          ],
          bewertung: [
            'erste Entscheidung mit zwei sich ergänzenden Bedingungen: 1 P',
            'Aktion Zustimmung einholen: 1 P',
            'zweite Entscheidung mit Bedingungen: 1 P',
            'Rückgabe-Aktion mit Endknoten: 1 P',
            'Zusammenführung der beiden Zweige: 1 P',
            'Teilung, zwei parallele Aktionen und Synchronisation: 1 P',
            'Reparieren, SMS und Endknoten in richtiger Reihenfolge: 1 P',
          ],
        },
        {
          nr: 'ba',
          punkte: 6,
          sp: ['AP1-8-2-3', 'AP1-8-2-1'],
          text: 'Bei der Übergabe eines E-Bikes soll die App abschätzen, wie viele der geplanten Fahrten eines Kunden mit einer Akkuladung möglich sind. Der Verbrauch hängt von der Unterstützungsstufe ab (1 = Eco, 2 = Tour, 3 = Turbo).\n\nFühren Sie einen Schreibtischtest für den Aufruf `anzahlFahrten([12, 20, 10, 22, 5], [2, 1, 3, 1, 2], 500)` durch. Tragen Sie die Werte am Ende jedes Schleifendurchlaufs (nach Zeile 21) ein. Die Spalte i zeigt den Wert zu Beginn des Durchlaufs. Geben Sie zum Schluss den Rückgabewert an.',
          vorgaben: [
            {
              titel: 'Pseudocode',
              nummern: true,
              code: 'funktion anzahlFahrten(km: Ganzzahl[], stufe: Ganzzahl[], akku: Ganzzahl): Ganzzahl\n  rest = akku\n  anzahl = 0\n  reicht = wahr\n  i = 0\n  solange i < länge(km) und reicht\n    wenn stufe[i] == 1 dann\n      faktor = 6\n    sonst wenn stufe[i] == 2 dann\n      faktor = 9\n    sonst\n      faktor = 14\n    ende wenn\n    bedarf = km[i] * faktor\n    wenn bedarf <= rest dann\n      rest = rest - bedarf\n      anzahl = anzahl + 1\n    sonst\n      reicht = falsch\n    ende wenn\n    i = i + 1\n  ende solange\n  rückgabe anzahl\nende funktion',
            },
            { hinweis: '`akku` ist der Energieinhalt des Akkus in Wh, `faktor` der Verbrauch in Wh je km. `länge(km)` liefert die Anzahl der Elemente, der erste Index ist 0. Beide Arrays sind gleich lang.' },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['i', 'km[i]', 'faktor', 'bedarf', 'rest', 'anzahl', 'reicht'],
            zeilen: [
              ['0', '12', null, null, null, null, null],
              ['1', '20', null, null, null, null, null],
              ['2', '10', null, null, null, null, null],
              ['3', '22', null, null, null, null, null],
              ['4', '5', null, null, null, null, null],
              ['Rückgabewert', '–', '–', '–', '–', null, '–'],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['i', 'km[i]', 'stufe[i]', 'faktor', 'bedarf', 'rest', 'anzahl', 'reicht'],
                zeilen: [
                  ['0', '12', '2', '9', '108', '392', '1', 'wahr'],
                  ['1', '20', '1', '6', '120', '272', '2', 'wahr'],
                  ['2', '10', '3', '14', '140', '132', '3', 'wahr'],
                  ['3', '22', '1', '6', '132', '0', '4', 'wahr'],
                  ['4', '5', '2', '9', '45', '0', '4', 'falsch'],
                ],
              },
            },
            'Im Durchlauf i = 3 ist bedarf = rest = 132. Die Bedingung `bedarf <= rest` ist erfüllt, die Fahrt zählt also noch. Im Durchlauf i = 4 ist 45 > 0, deshalb wird `reicht` falsch und die Schleife endet. **Rückgabewert: 4**.',
          ],
          bewertung: ['je vollständig richtiger Zeile 1 P (max. 5)', 'Rückgabewert 4: 1 P', 'Folgefehler werden weitergerechnet'],
        },
        {
          nr: 'bb',
          punkte: 3,
          sp: ['AP1-8-2-4', 'AP1-8-2-2'],
          text: 'In der App kann zusätzlich die Stufe 0 (Fahren ohne Motorunterstützung, kein Akkuverbrauch) gewählt werden. Andere Werte als 0 bis 3 kommen nicht vor.\n\nBeschreiben Sie, wie die Funktion eine Fahrt mit Stufe 0 bisher berechnet, und geben Sie eine Korrektur der Zeilen 7 bis 13 an.',
          antwort: { art: 'code', zeilen: 10 },
          loesung: [
            '**Bisher:** Stufe 0 ist weder 1 noch 2 und fällt daher in den `sonst`-Zweig: Es wird mit dem Turbo-Faktor 14 gerechnet. Der Verbrauch wird stark überschätzt, die Funktion liefert zu wenige Fahrten. Das ist ein logischer (inhaltlicher) Fehler – das Programm läuft ohne Fehlermeldung.',
            {
              code: '    wenn stufe[i] == 0 dann\n      faktor = 0\n    sonst wenn stufe[i] == 1 dann\n      faktor = 6\n    sonst wenn stufe[i] == 2 dann\n      faktor = 9\n    sonst\n      faktor = 14\n    ende wenn',
            },
            'Gleichwertig: den letzten Zweig in `sonst wenn stufe[i] == 3 dann faktor = 14` ändern und einen neuen `sonst`-Zweig mit `faktor = 0` anfügen.',
          ],
          bewertung: ['Beschreibung (Stufe 0 landet im sonst-Zweig, Faktor 14, Verbrauch zu hoch): 1 P', 'zusätzlicher Fall für Stufe 0 mit Faktor 0: 1 P', 'syntaktisch vollständige Verzweigung an richtiger Stelle: 1 P'],
        },
        {
          nr: 'ca',
          punkte: 2,
          sp: ['AP1-8-4-2'],
          text: 'Die Tabellenkalkulation der Werkstatt sieht bisher so aus (Auszug). Erläutern Sie das Problem, das diese Art der Speicherung verursacht.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Reparaturliste (Auszug)',
                kopf: ['AuftragNr', 'Datum', 'Kunde', 'E-Mail', 'Rahmennummer', 'Modell'],
                zeilen: [
                  ['3105', '04.03.', 'Lea Brandauer', 'l.brandauer@example.org', 'KS-88213-T', 'Trekking 28 Zoll'],
                  ['3106', '04.03.', 'Mirko Halstenberg', 'mirko.h@example.com', 'WB-10577-E', 'E-MTB 29 Zoll'],
                  ['3172', '21.04.', 'Lea Brandauer', 'lea.brandauer@example.net', 'KS-88213-T', 'Trekking 28 Zoll'],
                  ['…', '…', '…', '…', '…', '…'],
                ],
              },
            },
          ],
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Kunden- und Fahrraddaten werden bei jedem Auftrag erneut gespeichert (**Redundanz**). Das kostet Speicher und Arbeit, vor allem aber entstehen **Inkonsistenzen**: Bei Frau Brandauer stehen zwei verschiedene E-Mail-Adressen; man weiß nicht, welche gilt. Ändert sich eine Angabe, muss sie in allen Zeilen geändert werden (Änderungsanomalie); wird ein Auftrag gelöscht, gehen ggf. die einzigen Kundendaten verloren (Löschanomalie).',
          ],
          bewertung: ['Redundanz erkannt: 1 P', 'Folge erläutert (Inkonsistenz/Anomalie, am Beispiel): 1 P'],
        },
        {
          nr: 'cb',
          punkte: 7,
          sp: ['AP1-8-4-1'],
          text: 'Für die App wird ein Datenmodell entworfen. Der Anfang ist bereits gezeichnet. Ergänzen Sie das ER-Diagramm (Chen-Notation) mit Primärschlüsseln und Kardinalitäten:\n- Für ein Fahrrad können im Lauf der Zeit beliebig viele Reparaturaufträge angelegt werden. Ein Reparaturauftrag betrifft genau ein Fahrrad. Zu jedem Auftrag werden eine Auftragsnummer, das Annahmedatum und der Status gespeichert.\n- In einem Reparaturauftrag können mehrere Ersatzteile verbaut werden; dasselbe Ersatzteil kann in vielen Aufträgen verbaut werden. Zu einem Ersatzteil werden Artikelnummer, Bezeichnung und Preis gespeichert.\n- Für jedes in einem Auftrag verbaute Ersatzteil wird die Menge gespeichert.',
          vorgaben: [{ titel: 'Begonnenes ER-Diagramm', diagramm: erVorgabe }],
          antwort: { art: 'papier' },
          loesung: [
            { titel: 'Musterlösung', diagramm: erLoesung },
            'Element für Element:\n- Entität „Reparaturauftrag“\n- Attribute AuftragNr (unterstrichen), Annahmedatum, Status\n- Beziehung „betrifft“ zwischen Fahrrad und Reparaturauftrag mit 1 (Fahrrad) : n (Reparaturauftrag)\n- Entität „Ersatzteil“ mit ArtikelNr (unterstrichen), Bezeichnung, Preis\n- Beziehung „verbaut“ zwischen Reparaturauftrag und Ersatzteil\n- Kardinalität m:n an „verbaut“\n- Attribut „Menge“ an der Beziehung „verbaut“ (nicht am Auftrag und nicht am Ersatzteil)',
          ],
          bewertung: [
            'Entität Reparaturauftrag: 1 P',
            'Attribute des Auftrags mit Primärschlüssel: 1 P',
            'Beziehung Fahrrad – Reparaturauftrag mit 1:n: 1 P',
            'Entität Ersatzteil mit Attributen und Primärschlüssel: 1 P',
            'Beziehung verbaut: 1 P',
            'Kardinalität m:n: 1 P',
            'Menge an der Beziehung: 1 P',
            'andere Beziehungsnamen (z. B. „hat“, „enthält“) sind richtig',
          ],
        },
      ],
    },
  ],
};
