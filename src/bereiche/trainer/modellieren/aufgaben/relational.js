// Modus „Relationales Modell" – Format: siehe ../README.md

export const spickzettel = `- **Jede Entität wird eine Tabelle**, jedes Attribut eine Spalte, der Primärschlüssel (**PK**) bleibt PK
- **1:n**: Fremdschlüssel (**FK**) auf der **n-Seite** – er verweist auf den PK der 1-Seite
- **m:n**: eigene **Zwischentabelle** mit beiden FK; zusammen bilden sie den **zusammengesetzten PK**. Attribute der Beziehung kommen auch hierher
- **1:1**: FK in **eine** der beiden Tabellen; jeder Wert darf dort nur einmal vorkommen (UNIQUE)
- **Referenzielle Integrität**: Jeder FK-Wert verweist auf einen vorhandenen PK-Wert
- **ON DELETE CASCADE** löscht abhängige Datensätze mit, **ON UPDATE CASCADE** übernimmt einen geänderten PK in alle FK
- Ohne Weitergabe (**RESTRICT**) lehnt die Datenbank das Löschen ab, solange noch ein FK auf den Datensatz zeigt`;

// Spalten: '#' vorn = Primärschlüssel, '>' vorn = Fremdschlüssel, z. B. '#>BestellNr'
const spalte = (s) => {
  const [, z, name] = s.match(/^([#>]*)(.*)$/);
  return { name, ...(z.includes('#') ? { pk: true } : {}), ...(z.includes('>') ? { fk: true } : {}) };
};
const tab = (id, x, y, name, spalten, extra = {}) => ({ id, typ: 'tabelle', x, y, name, spalten: spalten.map(spalte), ...extra });
const rel = (von, nach, a, b, extra = {}) => ({ von, nach, typ: 'assoziation', textVon: a, textNach: b, ...extra });

// ER-Bausteine (für Vorlagen)
const breite = (t) => Math.max(84, Math.ceil(String(t).length * 7.9 + 22));
const ent = (id, x, y, text) => ({ id, typ: 'entitaet', x, y, text });
const bez = (id, x, y, text) => ({ id, typ: 'beziehung', x, y, text });
const att = (id, x, y, text, pk = false) => ({ id, typ: 'attribut', x, y, w: breite(text), text, ...(pk ? { pk: true } : {}) });
const lin = (von, nach, extra = {}) => ({ von, nach, typ: 'linie', ...extra });

const notationDiagramm = {
  breite: 780,
  hoehe: 230,
  knoten: [
    tab('kunde', 20, 50, 'Kunde', ['#KundenNr', 'Name', 'Ort']),
    tab('bestellung', 210, 50, 'Bestellung', ['#BestellNr', 'Datum', '>KundenNr']),
    tab('pos', 400, 50, 'Bestellposition', ['#>BestellNr', '#>ArtikelNr', 'Menge'], { w: 150 }),
    tab('artikel', 620, 50, 'Artikel', ['#ArtikelNr', 'Bezeichnung', 'Preis']),
    { id: 't1', typ: 'text', x: 305, y: 172, text: 'FK auf der n-Seite (1:n)', anker: 'middle', klein: true },
    { id: 't2', typ: 'text', x: 475, y: 172, text: 'Zwischentabelle (m:n):\nPK aus zwei FK', anker: 'middle', klein: true },
    { id: 't3', typ: 'text', x: 20, y: 210, text: 'PK = Primärschlüssel (unterstrichen)   FK = Fremdschlüssel (verweist auf einen PK)', anker: 'start', klein: true },
  ],
  kanten: [rel('kunde', 'bestellung', '1', 'n'), rel('bestellung', 'pos', '1', 'n'), rel('pos', 'artikel', 'n', '1')],
};

export const notation = {
  text: 'So liest du das Modell: Jede Tabelle hat einen Primärschlüssel (PK). Die Bestellung kennt ihren Kunden über den Fremdschlüssel KundenNr. Die m:n-Beziehung zwischen Bestellung und Artikel ist in die Zwischentabelle **Bestellposition** aufgelöst – dort steht auch die Menge. Ihr PK besteht aus beiden Fremdschlüsseln.',
  diagramm: notationDiagramm,
  punkte: [
    'Die Linie verbindet die Tabelle mit dem **FK** (Seite **n**) mit der Tabelle, auf deren **PK** er zeigt (Seite **1**).',
    'Eine m:n-Beziehung gibt es zwischen Tabellen nicht direkt – sie wird zu **zwei 1:n-Beziehungen** mit einer Zwischentabelle.',
    'In Textform schreibt man z. B. **Bestellung (BestellNr, Datum, ↑KundenNr)**: PK unterstrichen, FK mit Pfeil oder dem Zusatz (FK).',
    '**Referenzielle Integrität**: Es darf keine Bestellung mit einer KundenNr geben, die in Kunde nicht vorkommt.',
    '**Weitergabe**: ON DELETE CASCADE / ON UPDATE CASCADE geben Löschen bzw. Schlüsseländerung an die abhängigen Zeilen weiter; RESTRICT verbietet die Aktion.',
  ],
};

const KARD = ['1', 'n'];

// ---------- Kfz-Werkstatt (Fehler + Muster) ----------
function werkstatt(fehler) {
  const knoten = [
    tab('kunde', 20, 50, 'Kunde', ['#KundenNr', 'Name', 'Telefon']),
    tab('fzg', 270, 40, 'Fahrzeug', ['#FIN', 'Kennzeichen', 'Modell', '>KundenNr']),
    fehler ? tab('auftrag', 540, 50, 'Auftrag', ['AuftragsNr', '#Datum', '>FIN'], { marke: 2 }) : tab('auftrag', 540, 50, 'Auftrag', ['#AuftragsNr', 'Datum', '>FIN'], { hervor: true }),
  ];
  const kanten = [
    rel('kunde', 'fzg', fehler ? 'n' : '1', fehler ? '1' : 'n', fehler ? { marke: 1 } : { hervor: true }),
    rel('fzg', 'auftrag', '1', 'n', fehler ? { marke: 4 } : {}),
  ];
  if (fehler) {
    knoten.push(tab('teil', 537, 220, 'Ersatzteil', ['#TeilNr', 'Bezeichnung', 'Preis', '>AuftragsNr'], { marke: 3 }));
    kanten.push(rel('auftrag', 'teil', '1', 'n'));
  } else {
    knoten.push(tab('pos', 530, 230, 'Auftragsposition', ['#>AuftragsNr', '#>TeilNr', 'Menge'], { w: 150, hervor: true }));
    knoten.push(tab('teil', 270, 230, 'Ersatzteil', ['#TeilNr', 'Bezeichnung', 'Preis']));
    kanten.push(rel('auftrag', 'pos', '1', 'n'), rel('teil', 'pos', '1', 'n'));
  }
  return { breite: 720, hoehe: fehler ? 340 : 350, knoten, kanten };
}

export const aufgaben = [
  {
    id: 'rm-e1',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Abteilung, Mitarbeiter, Dienstwagen',
    text: 'Jeder Mitarbeiter gehört genau einer Abteilung an, eine Abteilung hat viele Mitarbeiter. Einige Mitarbeiter haben einen Dienstwagen: Jeder Dienstwagen ist genau einem Mitarbeiter zugeordnet, ein Mitarbeiter hat höchstens einen. Ergänze das relationale Modell.',
    diagramm: {
      breite: 660,
      hoehe: 190,
      knoten: [
        tab('abt', 20, 60, 'Abteilung', ['#AbteilungsNr', 'Bezeichnung']),
        tab('ma', 240, 50, 'Mitarbeiter', ['#PersonalNr', 'Name', '>{1}'], { w: 160 }),
        tab('dw', 480, 50, 'Dienstwagen', ['#FahrzeugNr', 'Modell', '>{3}'], { w: 150 }),
      ],
      kanten: [rel('abt', 'ma', '1', '{2}'), rel('ma', 'dw', '1', '{4}')],
    },
    felder: [
      { id: '1', label: 'Fremdschlüssel in „Mitarbeiter"', optionen: ['Bezeichnung', 'AbteilungsNr', 'FahrzeugNr'], erwartet: 'AbteilungsNr' },
      { id: '2', label: 'Kardinalität an „Mitarbeiter"', optionen: KARD, erwartet: 'n' },
      { id: '3', label: 'Fremdschlüssel in „Dienstwagen"', optionen: ['PersonalNr', 'AbteilungsNr', 'Name'], erwartet: 'PersonalNr' },
      { id: '4', label: 'Kardinalität an „Dienstwagen"', optionen: KARD, erwartet: '1' },
      {
        id: 'w',
        label: 'Warum steht der Fremdschlüssel in „Mitarbeiter" und nicht in „Abteilung"?',
        optionen: [
          'Weil die Tabelle Mitarbeiter mehr Spalten hat.',
          'Weil eine Zelle nur einen Wert enthält – in Abteilung müsste man viele Personalnummern eintragen.',
          'Weil Fremdschlüssel immer in der rechten Tabelle stehen.',
        ],
        erwartet: 'Weil eine Zelle nur einen Wert enthält – in Abteilung müsste man viele Personalnummern eintragen.',
      },
    ],
    loesung: [
      '[1] Abteilung – Mitarbeiter ist 1:n. Der FK kommt auf die **n-Seite**: Jeder Mitarbeiter speichert die AbteilungsNr seiner einen Abteilung.',
      '[2] Viele Mitarbeiter je Abteilung → n an der Tabelle mit dem FK.',
      '[3] Mitarbeiter – Dienstwagen ist 1:1. Der FK kommt in **eine** der beiden Tabellen. Weil nicht jeder Mitarbeiter einen Wagen hat, steht er sinnvoll beim Dienstwagen – so bleiben keine leeren Felder in Mitarbeiter.',
      '[4] Jeder Dienstwagen gehört genau einem Mitarbeiter, jeder Mitarbeiter hat höchstens einen → 1 an beiden Enden. Damit das gilt, darf eine PersonalNr in Dienstwagen nur einmal vorkommen (UNIQUE).',
      'Andersherum ginge es nicht: Eine Zelle in Abteilung kann nicht viele Personalnummern aufnehmen.',
    ],
  },
  {
    id: 'rm-e2',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Kursbuchung auflösen',
    text: 'Ein Schulungsanbieter: Ein Teilnehmer bucht mehrere Kurse, ein Kurs hat viele Teilnehmer (m:n). Zu jeder Buchung wird das Buchungsdatum gespeichert. Einen Kurs kann ein Teilnehmer nur einmal buchen. Ergänze die Zwischentabelle.',
    diagramm: {
      breite: 650,
      hoehe: 190,
      knoten: [
        tab('tn', 20, 50, 'Teilnehmer', ['#TeilnehmerNr', 'Name', 'E-Mail']),
        tab('buchung', 250, 50, 'Buchung', ['#>{1}', '#>KursNr', '{2}'], { w: 170 }),
        tab('kurs', 500, 50, 'Kurs', ['#KursNr', 'Titel', 'Preis']),
      ],
      kanten: [rel('tn', 'buchung', '1', 'n'), rel('buchung', 'kurs', '{3}', '1')],
    },
    felder: [
      { id: '1', label: 'Erste Spalte der Zwischentabelle (PK und FK)', optionen: ['Name', 'TeilnehmerNr', 'Titel'], erwartet: 'TeilnehmerNr' },
      { id: '2', label: 'Weitere Spalte der Zwischentabelle', optionen: ['Buchungsdatum', 'Preis', 'E-Mail'], erwartet: 'Buchungsdatum' },
      { id: '3', label: 'Kardinalität an „Buchung" (Linie zu Kurs)', optionen: KARD, erwartet: 'n' },
      {
        id: 'p',
        label: 'Primärschlüssel der Tabelle Buchung',
        optionen: ['nur TeilnehmerNr', 'nur KursNr', 'TeilnehmerNr und KursNr zusammen', 'Buchungsdatum'],
        erwartet: 'TeilnehmerNr und KursNr zusammen',
      },
    ],
    loesung: [
      '[1] Eine m:n-Beziehung wird mit einer **Zwischentabelle** aufgelöst. Sie enthält die PK beider Tabellen als Fremdschlüssel: TeilnehmerNr und KursNr.',
      '[2] Das Buchungsdatum gehört zum Paar Teilnehmer + Kurs, also in die Zwischentabelle. Preis und E-Mail stehen schon in Kurs bzw. Teilnehmer.',
      '[3] Ein Kurs hat viele Buchungen, jede Buchung gehört zu einem Kurs → 1 bei Kurs, n bei Buchung. Aus m:n werden **zwei 1:n**-Beziehungen.',
      'Der PK ist **zusammengesetzt**: Ein Teilnehmer kommt in vielen Buchungen vor, ein Kurs auch – erst das Paar ist eindeutig, weil jeder Kurs je Teilnehmer nur einmal gebucht wird.',
    ],
  },
  {
    id: 'rm-q1',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Referenzielle Integrität im Lager',
    text: 'Die Tabelle **Lieferant** enthält genau die Lieferanten **L01, L02 und L04**. Die Tabelle **Artikel** wurde aus einer alten Anwendung übernommen, die keine Fremdschlüssel geprüft hat:',
    tabelle: {
      kopf: ['ArtikelNr (PK)', 'Bezeichnung', 'LieferantNr (FK)'],
      zeilen: [
        ['A-100', 'Netzwerkkabel 2 m', 'L01'],
        ['A-101', 'Switch 8 Port', 'L02'],
        ['A-102', 'Patchpanel', 'L03'],
        ['A-103', 'Router', 'L01'],
        ['A-104', 'Dockingstation', 'L04'],
      ],
    },
    felder: [
      { id: 'a', label: 'Welche Zeile verletzt die referenzielle Integrität?', optionen: ['A-100', 'A-101', 'A-102', 'A-104'], erwartet: 'A-102' },
      {
        id: 'b',
        label: 'Der FK ist mit ON DELETE RESTRICT angelegt. Lieferant L02 soll gelöscht werden. Was passiert?',
        optionen: ['L02 wird gelöscht, A-101 bleibt unverändert.', 'Die Datenbank lehnt das Löschen ab, weil A-101 noch auf L02 verweist.', 'A-101 wird mitgelöscht.'],
        erwartet: 'Die Datenbank lehnt das Löschen ab, weil A-101 noch auf L02 verweist.',
      },
      {
        id: 'c',
        label: 'Jetzt mit ON DELETE CASCADE: Lieferant L01 wird gelöscht. Was passiert?',
        optionen: ['Die Artikel A-100 und A-103 werden mitgelöscht.', 'Nur A-100 wird mitgelöscht.', 'Das Löschen wird abgelehnt.', 'In A-100 und A-103 wird die LieferantNr geleert.'],
        erwartet: 'Die Artikel A-100 und A-103 werden mitgelöscht.',
      },
      {
        id: 'd',
        label: 'Lieferant L04 bekommt die neue Nummer L40 (ON UPDATE CASCADE). Was passiert?',
        optionen: ['A-104 wird gelöscht.', 'In A-104 steht danach automatisch L40.', 'Die Änderung wird abgelehnt, weil A-104 auf L04 verweist.'],
        erwartet: 'In A-104 steht danach automatisch L40.',
      },
      {
        id: 'e',
        label: 'Welcher neue Artikel wird bei geprüftem Fremdschlüssel abgewiesen?',
        optionen: ['A-105 mit LieferantNr L01', 'A-105 mit LieferantNr L09', 'A-105 mit LieferantNr L04'],
        erwartet: 'A-105 mit LieferantNr L09',
      },
    ],
    loesung: [
      'Referenzielle Integrität heißt: Jeder FK-Wert muss als PK in der Bezugstabelle vorkommen. L03 gibt es in Lieferant nicht → A-102 zeigt ins Leere.',
      '**RESTRICT** verbietet das Löschen eines Datensatzes, auf den noch ein FK zeigt.',
      '**ON DELETE CASCADE** gibt das Löschen weiter: Alle Artikel mit L01 verschwinden mit.',
      '**ON UPDATE CASCADE** gibt die Schlüsseländerung weiter: Der FK in A-104 wird auf L40 angepasst.',
      'Ein Einfügen mit einem FK-Wert, den es als PK nicht gibt (L09), wird abgewiesen.',
    ],
  },
  {
    id: 'rm-q2',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Regeln für das Überführen',
    text: 'Du überführst ER-Modelle in Tabellen. Wähle jeweils die richtige Umsetzung.',
    felder: [
      {
        id: 'a',
        label: 'Abteilung 1:n Mitarbeiter – wohin kommt der Fremdschlüssel?',
        optionen: ['in die Tabelle Abteilung', 'in die Tabelle Mitarbeiter', 'in eine neue Zwischentabelle'],
        erwartet: 'in die Tabelle Mitarbeiter',
      },
      {
        id: 'b',
        label: 'Projekt m:n Mitarbeiter – wie wird die Beziehung umgesetzt?',
        optionen: ['FK ProjektNr in Mitarbeiter', 'FK PersonalNr in Projekt', 'Zwischentabelle mit beiden FK als zusammengesetztem PK'],
        erwartet: 'Zwischentabelle mit beiden FK als zusammengesetztem PK',
      },
      {
        id: 'c',
        label: 'Mitarbeiter 1:1 Dienstausweis – wie wird die Beziehung umgesetzt?',
        optionen: ['FK in eine der beiden Tabellen; jeder Wert darf dort nur einmal vorkommen', 'immer mit einer Zwischentabelle', 'gar nicht – bei 1:1 ist kein Schlüssel nötig'],
        erwartet: 'FK in eine der beiden Tabellen; jeder Wert darf dort nur einmal vorkommen',
      },
      { id: 'd', label: 'Wie viele Tabellen entstehen aus „Kunde 1:n Bestellung" und „Bestellung m:n Artikel"?', optionen: ['3', '4', '5'], erwartet: '4' },
      {
        id: 'e',
        label: 'Im ER-Modell hängt „Menge" an der m:n-Beziehung Bestellung – Artikel. Wohin kommt die Spalte?',
        optionen: ['in die Tabelle Bestellung', 'in die Tabelle Artikel', 'in die Zwischentabelle'],
        erwartet: 'in die Zwischentabelle',
      },
      {
        id: 'f',
        label: 'An welches Ende der Linie schreibst du bei 1:n das n?',
        optionen: ['an die Tabelle mit dem Fremdschlüssel', 'an die Tabelle mit dem Primärschlüssel, auf den verwiesen wird', 'an die Tabelle mit weniger Zeilen'],
        erwartet: 'an die Tabelle mit dem Fremdschlüssel',
      },
    ],
    loesung: [
      '**1:n**: Der FK steht auf der n-Seite – jeder Mitarbeiter hat genau eine Abteilung, also genau einen Wert.',
      '**m:n**: Beide Seiten haben viele Partner, ein FK-Feld reicht nirgends. Die Zwischentabelle macht daraus zwei 1:n-Beziehungen.',
      '**1:1**: Ein FK in einer Tabelle genügt; die Eindeutigkeit (UNIQUE) verhindert, dass ein Ausweis zwei Mitarbeitern zugeordnet wird.',
      'Kunde, Bestellung, Artikel und die Zwischentabelle → **4** Tabellen. Beziehungsattribute wie die Menge wandern in die Zwischentabelle.',
      'Die Tabelle mit dem FK ist immer die n-Seite (bei 1:1 die eine 1-Seite).',
    ],
  },
  {
    id: 'rm-q3',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Lager-Modell überführen',
    text: 'Das ER-Modell eines Lagers soll in Tabellen überführt werden. Ein Artikel kann auf mehreren Lagerplätzen liegen, ein Lagerplatz kann mehrere Artikel aufnehmen. Je Artikel und Lagerplatz wird der Bestand gespeichert.',
    diagramm: {
      breite: 900,
      hoehe: 290,
      knoten: [
        ent('lager', 20, 120, 'Lager'),
        bez('hat', 200, 115, 'hat'),
        ent('platz', 370, 120, 'Lagerplatz'),
        bez('lagert', 560, 115, 'lagert'),
        ent('artikel', 740, 120, 'Artikel'),
        att('lnr', 10, 20, 'LagerNr', true),
        att('ort', 30, 220, 'Ort'),
        att('pnr', 330, 20, 'PlatzNr', true),
        att('regal', 450, 20, 'Regal'),
        att('bestand', 573, 225, 'Bestand'),
        att('anr', 700, 20, 'ArtikelNr', true),
        att('abez', 760, 220, 'Bezeichnung'),
      ],
      kanten: [
        lin('lager', 'hat', { textVon: '1' }),
        lin('hat', 'platz', { textNach: 'n' }),
        lin('platz', 'lagert', { textVon: 'm' }),
        lin('lagert', 'artikel', { textNach: 'n' }),
        lin('lnr', 'lager'),
        lin('ort', 'lager'),
        lin('pnr', 'platz'),
        lin('regal', 'platz'),
        lin('bestand', 'lagert'),
        lin('anr', 'artikel'),
        lin('abez', 'artikel'),
      ],
    },
    felder: [
      { id: 'a', label: 'Wie viele Tabellen entstehen?', optionen: ['3', '4', '5'], erwartet: '4' },
      { id: 'b', label: 'Wo steht der Fremdschlüssel LagerNr?', optionen: ['in der Tabelle Lager', 'in der Tabelle Lagerplatz', 'in der Zwischentabelle'], erwartet: 'in der Tabelle Lagerplatz' },
      { id: 'c', label: 'Primärschlüssel der Zwischentabelle', optionen: ['LagerNr und PlatzNr', 'PlatzNr und ArtikelNr', 'nur ArtikelNr', 'Bestand'], erwartet: 'PlatzNr und ArtikelNr' },
      { id: 'd', label: 'Wohin kommt die Spalte Bestand?', optionen: ['in die Tabelle Artikel', 'in die Tabelle Lagerplatz', 'in die Zwischentabelle'], erwartet: 'in die Zwischentabelle' },
      {
        id: 'e',
        label: 'Kardinalitäten zwischen Artikel und Zwischentabelle',
        optionen: ['1 bei Artikel, n bei der Zwischentabelle', 'n bei Artikel, 1 bei der Zwischentabelle', '1 an beiden Enden'],
        erwartet: '1 bei Artikel, n bei der Zwischentabelle',
      },
    ],
    loesung: [
      'Drei Entitäten werden drei Tabellen, die m:n-Beziehung „lagert" wird eine vierte (Zwischentabelle, z. B. „Bestand" oder „Lagerung").',
      'Lager – Lagerplatz ist 1:n → FK LagerNr auf der n-Seite, also in Lagerplatz.',
      'Die Zwischentabelle bekommt die PK beider beteiligten Tabellen: PlatzNr und ArtikelNr, zusammen der PK.',
      'Der Bestand hängt im ER-Modell an der Beziehung → Spalte der Zwischentabelle.',
      'Ein Artikel hat viele Zeilen in der Zwischentabelle (eine je Lagerplatz) → 1 bei Artikel, n bei der Zwischentabelle.',
    ],
  },
  {
    id: 'rm-f1',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Fehler im Werkstatt-Modell',
    text: 'Anforderung: Ein Kunde hat mehrere Fahrzeuge, jedes Fahrzeug gehört einem Kunden. Zu einem Fahrzeug gibt es viele Aufträge, jeder Auftrag hat eine eindeutige Auftragsnummer. In einem Auftrag werden mehrere Ersatzteile verbaut (mit Menge); dasselbe Ersatzteil wird in vielen Aufträgen verwendet. Prüfe die Stellen 1–4.',
    diagramm: werkstatt(true),
    felder: [
      {
        id: '1',
        label: 'Kardinalitäten zwischen Kunde und Fahrzeug',
        optionen: ['korrekt', 'vertauscht: 1 gehört an Kunde, n an Fahrzeug', 'muss 1:1 sein'],
        erwartet: 'vertauscht: 1 gehört an Kunde, n an Fahrzeug',
      },
      {
        id: '2',
        label: 'Primärschlüssel der Tabelle Auftrag',
        optionen: ['korrekt', 'falsch: Datum ist nicht eindeutig – AuftragsNr muss PK sein', 'falsch: FIN muss alleiniger PK sein'],
        erwartet: 'falsch: Datum ist nicht eindeutig – AuftragsNr muss PK sein',
      },
      {
        id: '3',
        label: 'Tabelle Ersatzteil mit FK AuftragsNr',
        optionen: [
          'korrekt',
          'falsch: m:n braucht eine Zwischentabelle (AuftragsNr, TeilNr, Menge)',
          'falsch: der FK muss TeilNr heißen',
          'falsch: Ersatzteil braucht keinen PK',
        ],
        erwartet: 'falsch: m:n braucht eine Zwischentabelle (AuftragsNr, TeilNr, Menge)',
      },
      {
        id: '4',
        label: 'FK FIN in Auftrag mit 1 bei Fahrzeug und n bei Auftrag',
        optionen: ['korrekt', 'falsch: FK gehört in Fahrzeug', 'falsch: muss m:n sein'],
        erwartet: 'korrekt',
      },
    ],
    loesung: [
      '[1] Der FK KundenNr steht in Fahrzeug – Fahrzeug ist also die n-Seite. Die 1 gehört an Kunde.',
      '[2] An einem Tag gibt es viele Aufträge. Der PK muss eindeutig sein → AuftragsNr.',
      '[3] Mit AuftragsNr in Ersatzteil könnte jedes Teil nur zu **einem** Auftrag gehören, und die Menge fehlt. Für m:n braucht es eine Zwischentabelle mit zusammengesetztem PK aus AuftragsNr und TeilNr plus Menge.',
      '[4] Richtig: Ein Fahrzeug hat viele Aufträge, der FK FIN steht auf der n-Seite.',
    ],
    muster: werkstatt(false),
  },
  {
    id: 'rm-q4',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Welche Weitergabe passt?',
    text: 'Wähle für jede Anforderung die passende Regel am Fremdschlüssel.',
    felder: [
      {
        id: 'a',
        label: 'Wird eine Bestellung gelöscht, sollen ihre Bestellpositionen automatisch mit verschwinden.',
        optionen: ['ON DELETE CASCADE', 'ON DELETE RESTRICT', 'ON UPDATE CASCADE', 'ON DELETE SET NULL'],
        erwartet: 'ON DELETE CASCADE',
      },
      {
        id: 'b',
        label: 'Ein Kunde, zu dem es noch Rechnungen gibt, darf nicht gelöscht werden.',
        optionen: ['ON DELETE CASCADE', 'ON DELETE RESTRICT', 'ON UPDATE CASCADE', 'ON DELETE SET NULL'],
        erwartet: 'ON DELETE RESTRICT',
      },
      {
        id: 'c',
        label: 'Ändert sich eine Artikelnummer, sollen alle Bestellpositionen die neue Nummer erhalten.',
        optionen: ['ON DELETE CASCADE', 'ON DELETE RESTRICT', 'ON UPDATE CASCADE', 'ON DELETE SET NULL'],
        erwartet: 'ON UPDATE CASCADE',
      },
      {
        id: 'd',
        label: 'Wird ein Trainer gelöscht, sollen seine Kurse bleiben – nur ohne Trainer-Zuordnung (FK leer).',
        optionen: ['ON DELETE CASCADE', 'ON DELETE RESTRICT', 'ON UPDATE CASCADE', 'ON DELETE SET NULL'],
        erwartet: 'ON DELETE SET NULL',
      },
      {
        id: 'e',
        label: 'Was stellt die referenzielle Integrität sicher?',
        optionen: [
          'Jeder Primärschlüsselwert kommt nur einmal vor.',
          'Jeder Fremdschlüsselwert verweist auf einen vorhandenen Primärschlüsselwert.',
          'Alle Tabellen sind in 3. Normalform.',
          'Jede Tabelle hat mindestens einen Fremdschlüssel.',
        ],
        erwartet: 'Jeder Fremdschlüsselwert verweist auf einen vorhandenen Primärschlüsselwert.',
      },
    ],
    loesung: [
      '**CASCADE** gibt die Aktion an die abhängigen Zeilen weiter: beim Löschen werden sie mitgelöscht, beim Ändern wird der FK angepasst.',
      '**RESTRICT** lehnt das Löschen ab, solange noch FK auf den Datensatz zeigen – wichtig, wenn Daten aufbewahrt werden müssen.',
      '**SET NULL** behält die abhängigen Zeilen und leert nur den FK. Das geht nur, wenn die FK-Spalte leer sein darf.',
      'Dass jeder PK einmalig ist, ist eine Eigenschaft des Primärschlüssels – die referenzielle Integrität betrifft die Verweise zwischen Tabellen.',
    ],
  },

  // ---------- Zeichnen ----------
  {
    id: 'rm-z1',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Fitnessstudio: ER-Modell überführen',
    text: 'Überführe das ER-Modell eines Fitnessstudios in ein relationales Modell. Kennzeichne Primär- und Fremdschlüssel und trage die Kardinalitäten an den Verbindungen ein.',
    vorlage: {
      breite: 950,
      hoehe: 450,
      knoten: [
        ent('tarif', 20, 150, 'Tarif'),
        bez('hat', 200, 145, 'hat'),
        ent('mitglied', 370, 150, 'Mitglied'),
        bez('belegt', 560, 145, 'belegt'),
        ent('kurs', 740, 150, 'Kurs'),
        bez('leitet', 745, 270, 'leitet'),
        ent('trainer', 740, 390, 'Trainer'),
        att('tnr', 10, 50, 'TarifNr', true),
        att('beitrag', 20, 250, 'Monatsbeitrag'),
        att('mnr', 330, 50, 'MitgliedsNr', true),
        att('mname', 460, 50, 'Name'),
        att('anm', 557, 250, 'Anmeldedatum'),
        att('knr', 700, 50, 'KursNr', true),
        att('kbez', 800, 50, 'Bezeichnung'),
        att('tag', 840, 215, 'Wochentag'),
        att('trnr', 600, 395, 'TrainerNr', true),
        att('trname', 860, 395, 'Name'),
      ],
      kanten: [
        lin('tarif', 'hat', { textVon: '1' }),
        lin('hat', 'mitglied', { textNach: 'n' }),
        lin('mitglied', 'belegt', { textVon: 'm' }),
        lin('belegt', 'kurs', { textNach: 'n' }),
        lin('kurs', 'leitet', { textVon: 'n' }),
        lin('leitet', 'trainer', { textNach: '1' }),
        lin('tnr', 'tarif'),
        lin('beitrag', 'tarif'),
        lin('mnr', 'mitglied'),
        lin('mname', 'mitglied'),
        lin('anm', 'belegt'),
        lin('knr', 'kurs'),
        lin('kbez', 'kurs'),
        lin('tag', 'kurs'),
        lin('trnr', 'trainer'),
        lin('trname', 'trainer'),
      ],
    },
    muster: {
      breite: 820,
      hoehe: 320,
      knoten: [
        tab('tarif', 20, 50, 'Tarif', ['#TarifNr', 'Monatsbeitrag']),
        tab('mitglied', 240, 40, 'Mitglied', ['#MitgliedsNr', 'Name', '>TarifNr']),
        tab('belegung', 448, 40, 'Belegung', ['#>MitgliedsNr', '#>KursNr', 'Anmeldedatum'], { w: 140 }),
        tab('kurs', 666, 30, 'Kurs', ['#KursNr', 'Bezeichnung', 'Wochentag', '>TrainerNr']),
        tab('trainer', 672, 220, 'Trainer', ['#TrainerNr', 'Name']),
      ],
      kanten: [rel('tarif', 'mitglied', '1', 'n'), rel('mitglied', 'belegung', '1', 'n'), rel('belegung', 'kurs', 'n', '1'), rel('kurs', 'trainer', 'n', '1')],
    },
    pruefliste: [
      'Fünf Tabellen: **Tarif**, **Mitglied**, **Kurs**, **Trainer** und eine **Zwischentabelle** für „belegt"',
      'FK **TarifNr** in Mitglied (n-Seite von Tarif – Mitglied)',
      'FK **TrainerNr** in Kurs (n-Seite von Trainer – Kurs)',
      'Zwischentabelle mit **MitgliedsNr** und **KursNr** – beide FK, zusammen der PK',
      '**Anmeldedatum** in der Zwischentabelle',
      'Alle PK gekennzeichnet (unterstrichen oder „PK"), alle FK gekennzeichnet (Pfeil oder „FK")',
      'Verbindungen mit Kardinalitäten: jeweils **1** an der Tabelle mit dem PK, **n** an der Tabelle mit dem FK',
    ],
    hinweise: 'Den Namen der Zwischentabelle wählst du selbst („Belegung", „Kursanmeldung" …). Auch die Textform ist erlaubt, z. B. Belegung (↑MitgliedsNr, ↑KursNr, Anmeldedatum) mit unterstrichenem PK.',
  },
  {
    id: 'rm-z2',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-2-2',
    titel: 'Projektzeiterfassung als Tabellenmodell',
    text: 'Entwirf das relationale Modell für eine Projektzeiterfassung. Kennzeichne PK und FK und trage die Kardinalitäten ein.\n- Jeder **Mitarbeiter** (PersonalNr, Name) gehört genau einer **Abteilung** (AbteilungsNr, Bezeichnung) an; eine Abteilung hat viele Mitarbeiter.\n- Ein Mitarbeiter arbeitet an mehreren **Projekten** (ProjektNr, Bezeichnung), an einem Projekt arbeiten mehrere Mitarbeiter. Je Mitarbeiter und Projekt wird die Summe der **Stunden** gespeichert.\n- Jedes Projekt gehört zu genau einem **Kunden** (KundenNr, Firma); ein Kunde kann mehrere Projekte haben.\n- Ein Mitarbeiter hat höchstens ein **Notebook** (InventarNr, Modell); jedes Notebook ist genau einem Mitarbeiter zugeordnet.',
    muster: {
      breite: 870,
      hoehe: 330,
      knoten: [
        tab('abt', 20, 50, 'Abteilung', ['#AbteilungsNr', 'Bezeichnung']),
        tab('ma', 236, 40, 'Mitarbeiter', ['#PersonalNr', 'Name', '>AbteilungsNr']),
        tab('zeit', 474, 40, 'Zeitbuchung', ['#>PersonalNr', '#>ProjektNr', 'Stunden'], { w: 140 }),
        tab('proj', 708, 40, 'Projekt', ['#ProjektNr', 'Bezeichnung', '>KundenNr']),
        tab('kunde', 714, 220, 'Kunde', ['#KundenNr', 'Firma']),
        tab('nb', 242, 220, 'Notebook', ['#InventarNr', 'Modell', '>PersonalNr']),
      ],
      kanten: [
        rel('abt', 'ma', '1', 'n'),
        rel('ma', 'zeit', '1', 'n'),
        rel('zeit', 'proj', 'n', '1'),
        rel('proj', 'kunde', 'n', '1'),
        rel('ma', 'nb', '1', '1'),
      ],
    },
    pruefliste: [
      'Sechs Tabellen: Abteilung, Mitarbeiter, Projekt, Kunde, Notebook und eine Zwischentabelle für Mitarbeiter – Projekt',
      'FK **AbteilungsNr** in Mitarbeiter, Verbindung 1 (Abteilung) zu n (Mitarbeiter)',
      'Zwischentabelle mit **PersonalNr** und **ProjektNr** als zusammengesetztem PK (beide FK) und der Spalte **Stunden**',
      'FK **KundenNr** in Projekt, Verbindung 1 (Kunde) zu n (Projekt)',
      '1:1 Mitarbeiter – Notebook: FK **PersonalNr** in Notebook (oder InventarNr in Mitarbeiter), Kardinalität 1 und 1',
      'Alle PK und FK eindeutig gekennzeichnet',
      'Keine Spalte doppelt: kein Abteilungsname in Mitarbeiter, kein Kundenname in Projekt',
    ],
    hinweise: 'Beim 1:1 ist der FK in Notebook günstiger: Nicht jeder Mitarbeiter hat ein Notebook, so bleibt in Mitarbeiter kein Feld leer. Damit es 1:1 bleibt, muss PersonalNr in Notebook eindeutig (UNIQUE) sein.',
  },
];

export default { spickzettel, notation, aufgaben };
