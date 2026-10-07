// Modus „Klassendiagramm" – Format: siehe ../README.md

export const spickzettel = `- **Klasse** = Kasten mit drei Bereichen: **Name** (Substantiv, Einzahl) | **Attribute** | **Methoden**
- **Attribut**: \`- preis : double\` – **Methode**: \`+ berechne(menge : int) : double\` (Sichtbarkeit Name(Parameter : Typ) : Rückgabetyp, \`void\` = keine Rückgabe)
- **Sichtbarkeit**: \`+\` public, \`-\` private, \`#\` protected (auch Unterklassen), \`~\` package (nur gleiches Paket) – \`#\` und \`~\` erst in AP2
- **Multiplizität** steht am Ende der **gezählten** Klasse: \`1\`, \`0..1\`, \`*\` (beliebig viele, auch keins), \`1..*\` (mindestens eins)
- **Vererbung**: hohles Dreieck **an der Oberklasse**; kursiv = abstrakt; **Interface** «interface», Realisierung gestrichelt mit hohlem Dreieck (AP2)
- **Aggregation** (hohle Raute) / **Komposition** (volle Raute): Raute **am Ganzen** – bei der Komposition kann das Teil **nicht ohne** das Ganze bestehen (AP2)
- **Gerichtete Assoziation**: offene Pfeilspitze – nur die Klasse am Anfang kennt die Klasse an der Spitze (AP2)`;

// Klasse mit etwas mehr Breite als die Automatik, damit lange Signaturen nicht am Rand kleben
const zeichen = (t) => String(t).replace(/^[*_]/, '').replace(/\{\d+\}/g, '[0]').length;
const kl = (id, x, y, name, attribute, methoden, mehr = {}) => ({
  id,
  typ: 'klasse',
  x,
  y,
  w: Math.max(110, Math.ceil(Math.max(zeichen(name) * 1.2, ...attribute.map(zeichen), ...methoden.map(zeichen)) * 7 + 18)),
  name,
  attribute,
  methoden,
  ...mehr,
});

// Multiplizität als freier Text – neben Rauten, wo die Endbeschriftung die Raute berühren würde
const mult = (id, x, y, text) => ({ id, typ: 'text', x, y, text, klein: true });

const notationDiagramm = {
  breite: 910,
  hoehe: 450,
  knoten: [
    kl('ausleihbar', 330, 10, 'Ausleihbar', [], ['+ ausleihen(leser : Leser) : void'], { stereotyp: 'interface' }),
    kl('medium', 330, 150, 'Medium', ['# titel : String', '- inventarNr : int', '~ standort : String'], ['+ getTitel() : String', '+ ausleihen(leser : Leser) : void', '*+ berechneLeihfrist() : int'], { abstrakt: true }),
    kl('buch', 216, 355, 'Buch', ['- isbn : String'], ['+ berechneLeihfrist() : int']),
    kl('dvd', 486, 355, 'DVD', ['- fsk : int'], ['+ berechneLeihfrist() : int']),
    kl('leser', 10, 172.5, 'Leser', ['- name : String', '- leserNr : int'], ['+ getName() : String']),
    kl('ausweis', 3, 355, 'Leserausweis', ['- gueltigBis : Date'], ['+ verlaengern() : void']),
    kl('regal', 720, 125, 'Regal', ['- nummer : String'], ['+ zaehleMedien() : int']),
    kl('verlag', 727, 235, 'Verlag', ['- name : String'], ['+ getName() : String']),
    mult('m-leser', 97, 295, '1'),
    mult('m-ausweis', 97, 342, '1'),
    { id: 'm-regal', typ: 'text', x: 690, y: 153, anker: 'middle', text: '0..1', klein: true },
    { id: 'n-abstrakt', typ: 'text', x: 322, y: 140, anker: 'end', text: 'kursiv = abstrakt', klein: true },
    { id: 'n-gen', typ: 'text', x: 463, y: 305, text: 'Generalisierung', klein: true },
  ],
  kanten: [
    { von: 'medium', nach: 'ausleihbar', typ: 'realisierung', vonSeite: 'oben', nachSeite: 'unten', text: 'Realisierung' },
    { von: 'buch', nach: 'medium', typ: 'generalisierung', vonSeite: 'oben', via: [[319.5, 320], [454.5, 320]], nachSeite: 'unten' },
    { von: 'dvd', nach: 'medium', typ: 'generalisierung', vonSeite: 'oben', via: [[589.5, 320], [454.5, 320]], nachSeite: 'unten' },
    { von: 'leser', nach: 'medium', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'leiht aus ▸', textVon: '0..1', textNach: '*' },
    { von: 'leser', nach: 'ausweis', typ: 'komposition', vonSeite: 'unten', nachSeite: 'oben', text: 'Komposition', textSeite: -1 },
    { von: 'regal', nach: 'medium', typ: 'aggregation', vonSeite: 'links', nachSeite: 'rechts:-55', text: 'Aggregation', textNach: '*', textSeite: -1 },
    { von: 'medium', nach: 'verlag', typ: 'gerichtet', vonSeite: 'rechts:55', nachSeite: 'links', text: 'gerichtet', textVon: '*', textNach: '1' },
  ],
};

export const notation = {
  text: 'So liest du das Diagramm: **Medium** ist abstrakt (kursiv) – es gibt nur Bücher und DVDs. Beide erben Titel, Inventarnummer und Methoden und müssen die abstrakte Methode `berechneLeihfrist()` selbst umsetzen. Medium realisiert das Interface **Ausleihbar**. Ein Leser leiht beliebig viele Medien aus, ein Medium ist bei keinem oder einem Leser. Ein Regal fasst Medien zusammen – ein Medium gibt es aber auch ohne Regal (Aggregation). Der Leserausweis gehört fest zum Leser und verschwindet mit ihm (Komposition). Ein Medium kennt seinen Verlag, der Verlag kennt seine Medien nicht (gerichtet). Für AP1 reichen Klasse, `+`/`-`, Assoziation und die Multiplizitäten `1` und `*`; alles Weitere kommt in AP2 dazu.',
  diagramm: notationDiagramm,
  punkte: [
    '**Sichtbarkeit** vor jedem Attribut und jeder Methode: `+` public, `-` private, `#` protected, `~` package. Attribute meist `-`, Methoden meist `+`.',
    '**Multiplizität** lesen: „Ein Leser leiht `*` Medien" – die Angabe steht **beim Medium**, also am anderen Ende der Linie.',
    '**Dreieck** zeigt immer zur Oberklasse bzw. zum Interface: durchgezogen = Vererbung, gestrichelt = Realisierung.',
    '**Raute** sitzt immer am Ganzen: voll = Komposition (Teil stirbt mit dem Ganzen), hohl = Aggregation (Teil lebt weiter).',
    '**Abstrakt** (kursiv oder `{abstract}`): Von der Klasse gibt es keine Objekte; abstrakte Methoden müssen die Unterklassen umsetzen.',
    '**Liste** statt Linie: `- medien : List<Medium>` als Attribut drückt dasselbe aus wie eine Assoziation mit `*`.',
  ],
};

const OPT_MULT_AP1 = ['1', '*'];
const OPT_MULT = ['1', '0..1', '1..*', '*'];
const OPT_SICHT = ['+', '#', '-', '~'];
const OPT_GANZES = ['Aggregation', 'Komposition'];

export const aufgaben = [
  // ---------- AP1-Niveau ----------
  {
    id: 'kl-e1',
    art: 'ergaenzen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-3-2',
    titel: 'Klasse Artikel im Lager',
    text: 'Für die Lagerverwaltung soll die Klasse **Artikel** modelliert werden. Ein Artikel hat eine Artikelnummer (ganze Zahl), eine Bezeichnung, einen Preis in Euro und Cent und einen Bestand. Andere Klassen dürfen die Attribute **nicht direkt** ändern; alle Methoden sind öffentlich. `einlagern` bekommt eine Menge übergeben, erhöht den Bestand und **gibt nichts zurück**. `istVerfuegbar` prüft, ob eine gewünschte Menge vorrätig ist. Ergänze die Lücken.',
    diagramm: {
      breite: 520,
      hoehe: 200,
      knoten: [
        kl('artikel', 120, 15, 'Artikel', ['{1} artikelNr : int', '- bezeichnung : String', '- preis : {2}', '- bestand : int'], ['+ getPreis() : double', '{3}', '+ istVerfuegbar(menge : int) : {4}'], { w: 280 }),
      ],
      kanten: [],
    },
    felder: [
      { id: '1', label: 'Sichtbarkeit von artikelNr', optionen: ['+', '-'], erwartet: '-' },
      { id: '2', label: 'Datentyp von preis', optionen: ['int', 'String', 'double', 'boolean'], erwartet: 'double' },
      {
        id: '3',
        label: 'Methode einlagern',
        optionen: ['+ einlagern() : void', '+ einlagern(menge : int) : int', '+ einlagern(menge : int) : void', '+ void einlagern(int menge)'],
        erwartet: '+ einlagern(menge : int) : void',
      },
      { id: '4', label: 'Rückgabetyp von istVerfuegbar', optionen: ['void', 'boolean', 'int', 'String'], erwartet: 'boolean' },
      {
        id: 'b',
        label: 'In welchem Bereich der Klasse stehen die Methoden?',
        optionen: ['Im oberen Bereich, neben dem Namen', 'Im mittleren Bereich, unter den Attributen', 'Im unteren Bereich, unter den Attributen'],
        erwartet: 'Im unteren Bereich, unter den Attributen',
      },
    ],
    loesung: [
      '[1] „Nicht direkt ändern" heißt Datenkapselung → `-` (private). Zugriff gibt es nur über Methoden wie `getPreis()`.',
      '[2] Euro **und Cent** brauchen Nachkommastellen → `double`. `int` kann nur ganze Zahlen speichern.',
      '[3] Eine Methode notierst du als `Sichtbarkeit name(parameter : Typ) : Rückgabetyp`. Die Menge wird übergeben → Parameter `menge : int`; nichts zurück → `void`. Die Java-Schreibweise mit dem Typ vorn ist in UML falsch.',
      '[4] „Prüft, ob …" hat als Antwort ja oder nein → `boolean`.',
      'Der Kasten hat drei Bereiche: oben der Name, in der Mitte die Attribute, unten die Methoden.',
    ],
  },
  {
    id: 'kl-e2',
    art: 'ergaenzen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-3-2',
    titel: 'Kfz-Werkstatt: Multiplizitäten',
    text: 'In der Kfz-Werkstatt gilt: Ein Kunde kann **beliebig viele** Fahrzeuge besitzen; jedes Fahrzeug gehört **genau einem** Kunden. Ein Auftrag betrifft **genau ein** Fahrzeug; für ein Fahrzeug kann es **beliebig viele** Aufträge geben. Trage die Multiplizitäten ein.',
    diagramm: {
      breite: 870,
      hoehe: 200,
      knoten: [
        kl('kunde', 20, 53.5, 'Kunde', ['- kundenNr : int', '- name : String'], ['+ getName() : String']),
        kl('fzg', 310, 53.5, 'Fahrzeug', ['- kennzeichen : String', '- marke : String'], ['+ getKennzeichen() : String']),
        kl('auftrag', 640, 46, 'Auftrag', ['- auftragsNr : int', '- datum : Date', '- beschreibung : String'], ['+ berechneKosten() : double']),
      ],
      kanten: [
        { von: 'kunde', nach: 'fzg', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'besitzt ▸', textVon: '{1}', textNach: '{2}' },
        { von: 'fzg', nach: 'auftrag', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: '◂ betrifft', textVon: '{3}', textNach: '{4}' },
      ],
    },
    felder: [
      { id: '1', label: 'Multiplizität am Kunden (Linie Kunde – Fahrzeug)', optionen: OPT_MULT_AP1, erwartet: '1' },
      { id: '2', label: 'Multiplizität am Fahrzeug (Linie Kunde – Fahrzeug)', optionen: OPT_MULT_AP1, erwartet: '*' },
      { id: '3', label: 'Multiplizität am Fahrzeug (Linie Fahrzeug – Auftrag)', optionen: OPT_MULT_AP1, erwartet: '1' },
      { id: '4', label: 'Multiplizität am Auftrag (Linie Fahrzeug – Auftrag)', optionen: OPT_MULT_AP1, erwartet: '*' },
      {
        id: 'l',
        label: 'Wie liest du das `*` am Ende bei „Auftrag"?',
        optionen: ['Ein Auftrag betrifft beliebig viele Fahrzeuge.', 'Zu einem Fahrzeug gibt es beliebig viele Aufträge, auch keinen.', 'Es gibt im System genau einen Auftrag.'],
        erwartet: 'Zu einem Fahrzeug gibt es beliebig viele Aufträge, auch keinen.',
      },
    ],
    loesung: [
      'Die Multiplizität steht an dem Ende, dessen Objekte gezählt werden. Frage dich: „Ein Fahrzeug gehört wie vielen Kunden?" → genau einem → **1** an den Kunden [1].',
      '„Ein Kunde besitzt wie viele Fahrzeuge?" → beliebig viele → `*` an das Fahrzeug [2].',
      '„Ein Auftrag betrifft wie viele Fahrzeuge?" → genau eins → **1** an das Fahrzeug [3].',
      '„Ein Fahrzeug hat wie viele Aufträge?" → beliebig viele → `*` an den Auftrag [4]. `*` schließt null ein.',
    ],
  },
  {
    id: 'kl-f1',
    art: 'fehler',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-3-2',
    titel: 'Fehler in der Arztpraxis',
    text: 'In einer Arztpraxis gilt: Ein Patient kann **beliebig viele** Termine haben, jeder Termin gehört zu **genau einem** Patienten. Attribute sind privat, Methoden öffentlich. Ein Kollege hat das Diagramm gezeichnet. Prüfe die markierten Stellen 1–4.',
    diagramm: {
      breite: 820,
      hoehe: 200,
      knoten: [
        kl('patient', 20, 30, 'Patient', ['+ versichertenNr : String', '- name : String', '- geburtsdatum : Date'], ['+ getName() : String', '+ int berechneAlter()']),
        kl('termin', 470, 30, 'Termin', ['- datum : Date', '- uhrzeit : String', '- grund : String'], ['+ verschieben(neuesDatum : Date) : void', '+ absagen() : void']),
        { id: 'm1', typ: 'text', x: 229, y: 72, text: '', marke: 1 },
        { id: 'm2', typ: 'text', x: 229, y: 142, text: '', marke: 2 },
        { id: 'm3', typ: 'text', x: 777, y: 127, text: '', marke: 3 },
      ],
      kanten: [{ von: 'patient', nach: 'termin', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'hat ▸', textVon: '*', textNach: '1', marke: 4 }],
    },
    felder: [
      {
        id: '1',
        label: 'Attribut `+ versichertenNr : String`',
        optionen: ['korrekt', 'Sichtbarkeit falsch: Attribute sind privat (-)', 'Typ falsch: muss boolean sein', 'Doppelpunkt ist überflüssig'],
        erwartet: 'Sichtbarkeit falsch: Attribute sind privat (-)',
      },
      {
        id: '2',
        label: 'Methode `+ int berechneAlter()`',
        optionen: ['korrekt', 'Methoden brauchen keine Sichtbarkeit', 'Rückgabetyp steht in UML hinten: + berechneAlter() : int', 'Methode muss private sein'],
        erwartet: 'Rückgabetyp steht in UML hinten: + berechneAlter() : int',
      },
      {
        id: '3',
        label: 'Methode `+ verschieben(neuesDatum : Date) : void`',
        optionen: ['korrekt', 'Parameter braucht keinen Typ', 'void ist als Rückgabetyp nicht erlaubt', 'Klammern sind überflüssig'],
        erwartet: 'korrekt',
      },
      {
        id: '4',
        label: 'Multiplizitäten an der Linie Patient – Termin',
        optionen: ['korrekt', 'vertauscht: 1 gehört an Patient, * an Termin', 'beide Enden müssen * sein', 'beide Enden müssen 1 sein'],
        erwartet: 'vertauscht: 1 gehört an Patient, * an Termin',
      },
    ],
    loesung: [
      '[1] Attribute werden gekapselt: `-` (private). Von außen greift man über Methoden zu.',
      '[2] In UML steht der Rückgabetyp **hinter** der Klammer, getrennt durch Doppelpunkt: `+ berechneAlter() : int`. Typ vorn ist Java-Schreibweise.',
      '[3] Richtig: Parameter als `name : Typ`, `void` heißt „keine Rückgabe".',
      '[4] „Ein Termin gehört zu genau einem Patienten" → **1** beim Patienten. „Ein Patient hat beliebig viele Termine" → `*` beim Termin.',
    ],
    muster: {
      breite: 820,
      hoehe: 200,
      knoten: [
        kl('patient', 20, 30, 'Patient', ['- versichertenNr : String', '- name : String', '- geburtsdatum : Date'], ['+ getName() : String', '+ berechneAlter() : int']),
        kl('termin', 470, 30, 'Termin', ['- datum : Date', '- uhrzeit : String', '- grund : String'], ['+ verschieben(neuesDatum : Date) : void', '+ absagen() : void']),
      ],
      kanten: [{ von: 'patient', nach: 'termin', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'hat ▸', textVon: '1', textNach: '*', hervor: true }],
    },
  },
  {
    id: 'kl-q1',
    art: 'fragen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-3-2',
    titel: 'Klassen aus einem Text ableiten',
    text: 'Ein Kino beschreibt seine Anforderungen: „Jeder **Film** hat einen **Titel**, eine **Dauer** in ganzen Minuten und eine Altersfreigabe. Für jede **Vorstellung** wird gespeichert, ob sie **in 3D** läuft. Kunden können für eine Vorstellung **Tickets kaufen**." Ordne zu.',
    felder: [
      { id: 'a', label: '„Film"', optionen: ['Klasse', 'Attribut', 'Methode'], erwartet: 'Klasse' },
      { id: 'b', label: '„Titel"', optionen: ['Klasse', 'Attribut', 'Methode'], erwartet: 'Attribut' },
      { id: 'c', label: '„Tickets kaufen"', optionen: ['Klasse', 'Attribut', 'Methode'], erwartet: 'Methode' },
      { id: 'd', label: 'Datentyp für „Dauer in ganzen Minuten"', optionen: ['String', 'int', 'boolean', 'Date'], erwartet: 'int' },
      { id: 'e', label: 'Datentyp für „läuft in 3D"', optionen: ['String', 'int', 'boolean', 'double'], erwartet: 'boolean' },
      {
        id: 'f',
        label: 'Die Methode zum Ticketkauf bekommt die Anzahl und liefert den Gesamtpreis. Wie notierst du sie?',
        optionen: ['+ kaufeTickets() : double', '+ kaufeTickets(anzahl : int) : void', '+ kaufeTickets(anzahl : int) : double', '+ double kaufeTickets(int anzahl)'],
        erwartet: '+ kaufeTickets(anzahl : int) : double',
      },
      {
        id: 'g',
        label: 'Warum sind Attribute meist privat (-)?',
        optionen: ['Damit sie schneller gespeichert werden', 'Datenkapselung: Zugriff nur über die Methoden der Klasse', 'Weil UML öffentliche Attribute verbietet'],
        erwartet: 'Datenkapselung: Zugriff nur über die Methoden der Klasse',
      },
    ],
    loesung: [
      '**Substantive**, die eigene Eigenschaften haben, werden Klassen (Film, Vorstellung, Kunde).',
      '**Eigenschaften** eines Substantivs werden Attribute (Titel, Dauer, Altersfreigabe, 3D).',
      '**Tätigkeiten** (Verben) werden Methoden – „Tickets kaufen" → `kaufeTickets(…)`.',
      'Ganze Zahlen → `int`, ja/nein → `boolean`. Übergebene Werte stehen als `name : Typ` in der Klammer, die Rückgabe hinter dem Doppelpunkt.',
      'Private Attribute schützen die Daten: Nur die Klasse selbst entscheidet, wie sie geändert werden (z. B. kein negativer Preis).',
    ],
  },

  // ---------- AP2-Niveau ----------
  {
    id: 'kl-e3',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Zahlungsarten an der Kinokasse',
    text: 'Das Kassensystem eines Kinos kennt Barzahlung und Kartenzahlung, aber keine „allgemeine" Zahlung. Den Betrag sollen die Unterklassen direkt lesen dürfen, andere Klassen nicht. Die Kassennummer dürfen nur Klassen **im selben Paket** sehen. `ausfuehren()` meldet zurück, ob die Zahlung geklappt hat. Nur Kartenzahlungen kann man stornieren. Ergänze die Lücken und beantworte die Fragen.',
    diagramm: {
      breite: 760,
      hoehe: 330,
      knoten: [
        kl('zahlung', 168, 20, 'Zahlung', ['{1} betrag : double', '# datum : Date', '{3} kassenNr : int'], ['+ getBetrag() : double', '*+ ausfuehren() : {2}'], { abstrakt: true, w: 196 }),
        kl('bar', 40, 220, 'Barzahlung', ['- erhalten : double'], ['+ ausfuehren() : boolean', '+ berechneWechselgeld() : double']),
        kl('karte', 330, 220, 'Kartenzahlung', ['- kartenNr : String'], ['+ ausfuehren() : boolean', '+ stornieren() : void']),
        kl('storno', 560, 20, 'Stornierbar', [], ['+ stornieren() : void'], { stereotyp: 'interface' }),
      ],
      kanten: [
        { von: 'bar', nach: 'zahlung', typ: 'generalisierung', vonSeite: 'oben', via: [[161, 185], [266, 185]], nachSeite: 'unten' },
        { von: 'karte', nach: 'zahlung', typ: 'generalisierung', vonSeite: 'oben', via: [[423, 185], [266, 185]], nachSeite: 'unten' },
        { von: 'karte', nach: 'storno', typ: 'realisierung', vonSeite: 'rechts', via: [[642.5, 266.5]], nachSeite: 'unten' },
      ],
    },
    felder: [
      { id: '1', label: 'Sichtbarkeit von betrag', optionen: OPT_SICHT, erwartet: '#' },
      { id: '2', label: 'Rückgabetyp von ausfuehren()', optionen: ['void', 'double', 'boolean', 'Zahlung'], erwartet: 'boolean' },
      { id: '3', label: 'Sichtbarkeit von kassenNr', optionen: OPT_SICHT, erwartet: '~' },
      {
        id: 'a',
        label: 'Was bedeutet der kursive Name „Zahlung"?',
        optionen: ['Zahlung ist ein Interface.', 'Zahlung ist abstrakt: Objekte gibt es nur von den Unterklassen.', 'Zahlung ist statisch und existiert nur einmal.', 'Zahlung ist privat und von außen unsichtbar.'],
        erwartet: 'Zahlung ist abstrakt: Objekte gibt es nur von den Unterklassen.',
      },
      {
        id: 'b',
        label: 'Warum steht `ausfuehren()` in beiden Unterklassen noch einmal?',
        optionen: ['Methoden werden nicht vererbt.', 'Die Unterklassen setzen die abstrakte Methode selbst um (überschreiben).', 'Das ist ein Fehler – doppelte Methoden sind verboten.'],
        erwartet: 'Die Unterklassen setzen die abstrakte Methode selbst um (überschreiben).',
      },
      {
        id: 'c',
        label: 'Was bedeutet die gestrichelte Linie mit hohlem Dreieck von Kartenzahlung zu Stornierbar?',
        optionen: ['Stornierbar ist eine Unterklasse von Kartenzahlung.', 'Kartenzahlung besteht aus Stornierbar-Teilen.', 'Kartenzahlung realisiert das Interface und muss stornieren() anbieten.'],
        erwartet: 'Kartenzahlung realisiert das Interface und muss stornieren() anbieten.',
      },
    ],
    loesung: [
      '[1] Zugriff für die Klasse selbst **und ihre Unterklassen**, aber nicht für andere → `#` (protected).',
      '[2] „Ob es geklappt hat" ist ja oder nein → `boolean`.',
      '[3] Sichtbar nur im gleichen Paket → `~` (package).',
      'Kursiver Klassenname = **abstrakte Klasse**: `new Zahlung()` ist nicht möglich. Eine kursive Methode ist abstrakt, sie hat keinen Rumpf.',
      'Jede konkrete Unterklasse muss die abstrakte Methode umsetzen – deshalb steht `ausfuehren()` in Bar- und Kartenzahlung erneut.',
      'Gestrichelt mit hohlem Dreieck = **Realisierung**: Die Klasse verspricht, alle Methoden des Interfaces anzubieten.',
    ],
  },
  {
    id: 'kl-e4',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Kino: Beziehungen und Multiplizitäten',
    text: 'Ein Kino hat **mindestens einen** Saal. Säle gibt es nur als Teil ihres Kinos – wird das Kino gelöscht, verschwinden auch seine Säle. Jeder Saal hat mindestens einen Sitzplatz. Eine Vorstellung findet in **genau einem** Saal statt; in einem Saal laufen **beliebig viele** Vorstellungen. Jede Vorstellung zeigt **genau einen** Film. Die Vorstellung kennt ihren Film, der Film kennt seine Vorstellungen **nicht**. Ergänze die Lücken [1]–[3] und bestimme die Beziehungen an den Stellen 4 und 5.',
    diagramm: {
      breite: 850,
      hoehe: 350,
      knoten: [
        kl('kino', 20, 41, 'Kino', ['- name : String'], ['+ getSaele() : List<Saal>']),
        kl('saal', 330, 41, 'Saal', ['- nummer : int'], ['+ zaehlePlaetze() : int']),
        kl('platz', 625, 33.5, 'Sitzplatz', ['- reihe : int', '- platz : int'], ['+ getBezeichnung() : String']),
        kl('vorst', 298.5, 250, 'Vorstellung', ['- beginn : Date'], ['+ buche(p : Sitzplatz) : boolean']),
        kl('film', 660, 242.5, 'Film', ['- titel : String', '- dauer : int'], ['+ getTitel() : String']),
      ],
      kanten: [
        { von: 'kino', nach: 'saal', typ: 'linie', vonSeite: 'rechts', nachSeite: 'links', textVon: '1', textNach: '{1}', marke: 4 },
        { von: 'saal', nach: 'platz', typ: 'komposition', vonSeite: 'rechts', nachSeite: 'links', textVon: '1', textNach: '1..*' },
        { von: 'saal', nach: 'vorst', typ: 'assoziation', vonSeite: 'unten', nachSeite: 'oben', text: 'findet statt in ▴', textVon: '1', textNach: '{2}' },
        { von: 'vorst', nach: 'film', typ: 'linie', vonSeite: 'rechts', nachSeite: 'links', text: 'zeigt ▸', textVon: '*', textNach: '{3}', marke: 5 },
      ],
    },
    felder: [
      { id: '1', label: 'Multiplizität am Saal (Kino – Saal)', optionen: OPT_MULT, erwartet: '1..*' },
      { id: '2', label: 'Multiplizität an der Vorstellung (Saal – Vorstellung)', optionen: OPT_MULT, erwartet: '*' },
      { id: '3', label: 'Multiplizität am Film (Vorstellung – Film)', optionen: OPT_MULT, erwartet: '1' },
      {
        id: '4',
        label: 'Beziehung zwischen Kino und Saal',
        optionen: ['Assoziation', 'Aggregation, hohle Raute am Kino', 'Komposition, volle Raute am Kino', 'Komposition, volle Raute am Saal'],
        erwartet: 'Komposition, volle Raute am Kino',
      },
      {
        id: '5',
        label: 'Beziehung zwischen Vorstellung und Film',
        optionen: ['gerichtete Assoziation, Pfeil zeigt auf Vorstellung', 'gerichtete Assoziation, Pfeil zeigt auf Film', 'Generalisierung, Dreieck am Film', 'Komposition, volle Raute an der Vorstellung'],
        erwartet: 'gerichtete Assoziation, Pfeil zeigt auf Film',
      },
    ],
    loesung: [
      '[1] „Mindestens ein Saal" → `1..*`. `*` wäre falsch, weil es auch null Säle erlaubt.',
      '[2] „In einem Saal laufen beliebig viele Vorstellungen" → `*` an der Vorstellung.',
      '[3] „Jede Vorstellung zeigt genau einen Film" → `1` am Film.',
      '[4] Säle gibt es nur als Teil des Kinos und sie verschwinden mit ihm → **Komposition**. Die volle Raute sitzt am **Ganzen**, also am Kino.',
      '[5] Nur die Vorstellung kennt den Film → **gerichtete Assoziation**. Die offene Pfeilspitze zeigt auf die Klasse, die gekannt wird: den Film.',
    ],
  },
  {
    id: 'kl-f2',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Fehler im Schulungszentrum',
    text: 'Ein Schulungszentrum verwaltet Kurse. Personen sind entweder Teilnehmer oder Dozenten; von Person selbst gibt es keine Objekte. Jeder Kurs besteht aus mindestens einem Kurstermin, Termine gibt es nur innerhalb ihres Kurses. Ein Dozent leitet beliebig viele Kurse, jeder Kurs hat genau einen Dozenten. Kurse realisieren das Interface Zertifizierbar. Prüfe die markierten Stellen 1–4.',
    diagramm: {
      breite: 870,
      hoehe: 510,
      knoten: [
        kl('person', 150, 20, 'Person', ['# name : String', '# email : String'], ['+ getName() : String', '*+ getRolle() : String'], { abstrakt: true, marke: 4 }),
        kl('tn', 20, 210, 'Teilnehmer', ['- kundenNr : int'], ['+ getRolle() : String']),
        kl('doz', 225, 210, 'Dozent', ['- stundensatz : double'], ['+ getRolle() : String', '+ berechneHonorar(std : int) : double']),
        kl('kurs', 620, 210, 'Kurs', ['- titel : String', '- preis : double'], ['+ erstelleZertifikat() : String']),
        kl('zert', 620, 20, 'Zertifizierbar', [], ['+ erstelleZertifikat() : String'], { stereotyp: 'interface' }),
        kl('termin', 623.5, 400, 'Kurstermin', ['- datum : Date', '- raum : String'], ['+ verschieben(d : Date) : void']),
        mult('m-kurs', 745, 318, '1'),
        mult('m-termin', 745, 372, '1..*'),
      ],
      kanten: [
        { von: 'person', nach: 'tn', typ: 'generalisierung', vonSeite: 'unten:-40', via: [[192.5, 170], [102.5, 170]], nachSeite: 'oben', marke: 1 },
        { von: 'doz', nach: 'person', typ: 'generalisierung', vonSeite: 'oben', via: [[363.5, 170], [272.5, 170]], nachSeite: 'unten:40' },
        { von: 'doz', nach: 'kurs', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'leitet ▸', textVon: '1', textNach: '*' },
        { von: 'kurs', nach: 'zert', typ: 'generalisierung', vonSeite: 'oben', nachSeite: 'unten', marke: 3 },
        { von: 'termin', nach: 'kurs', typ: 'komposition', vonSeite: 'oben', nachSeite: 'unten', marke: 2 },
      ],
    },
    felder: [
      {
        id: '1',
        label: 'Generalisierung zwischen Person und Teilnehmer',
        optionen: ['korrekt', 'Pfeilrichtung falsch: Dreieck gehört an Person', 'muss gestrichelt sein', 'muss eine Komposition sein'],
        erwartet: 'Pfeilrichtung falsch: Dreieck gehört an Person',
      },
      {
        id: '2',
        label: 'Komposition zwischen Kurs und Kurstermin',
        optionen: ['korrekt', 'Raute am falschen Ende: sie gehört an den Kurs', 'muss eine Aggregation sein', 'Multiplizität 1..* ist bei Komposition verboten'],
        erwartet: 'Raute am falschen Ende: sie gehört an den Kurs',
      },
      {
        id: '3',
        label: 'Linie zwischen Kurs und «interface» Zertifizierbar',
        optionen: ['korrekt', 'muss gestrichelt sein (Realisierung)', 'Pfeilrichtung falsch', 'muss eine gerichtete Assoziation sein'],
        erwartet: 'muss gestrichelt sein (Realisierung)',
      },
      {
        id: '4',
        label: 'Klasse Person mit kursivem Namen und kursiver Methode getRolle()',
        optionen: ['korrekt', 'abstrakte Klassen dürfen keine Attribute haben', 'kursiv bedeutet statisch', 'abstrakte Methoden gehören nur in Interfaces'],
        erwartet: 'korrekt',
      },
    ],
    loesung: [
      '[1] Das hohle Dreieck zeigt immer zur **Oberklasse**. Teilnehmer erbt von Person, also Linie von Teilnehmer zu Person mit dem Dreieck an Person.',
      '[2] Die Raute sitzt am **Ganzen**. Der Kurs besteht aus Terminen → volle Raute am Kurs. Die Multiplizitäten (1 am Kurs, 1..* am Termin) stimmen.',
      '[3] Eine Klasse **realisiert** ein Interface: gestrichelte Linie mit hohlem Dreieck. Durchgezogen wäre Vererbung zwischen Klassen.',
      '[4] Richtig: Von Person gibt es keine Objekte → abstrakt (kursiv). Eine abstrakte Klasse darf Attribute und abstrakte Methoden haben; die Unterklassen setzen `getRolle()` um.',
    ],
    muster: {
      breite: 870,
      hoehe: 510,
      knoten: [
        kl('person', 150, 20, 'Person', ['# name : String', '# email : String'], ['+ getName() : String', '*+ getRolle() : String'], { abstrakt: true }),
        kl('tn', 20, 210, 'Teilnehmer', ['- kundenNr : int'], ['+ getRolle() : String']),
        kl('doz', 225, 210, 'Dozent', ['- stundensatz : double'], ['+ getRolle() : String', '+ berechneHonorar(std : int) : double']),
        kl('kurs', 620, 210, 'Kurs', ['- titel : String', '- preis : double'], ['+ erstelleZertifikat() : String']),
        kl('zert', 620, 20, 'Zertifizierbar', [], ['+ erstelleZertifikat() : String'], { stereotyp: 'interface' }),
        kl('termin', 623.5, 400, 'Kurstermin', ['- datum : Date', '- raum : String'], ['+ verschieben(d : Date) : void']),
        mult('m-kurs', 745, 334, '1'),
        mult('m-termin', 745, 388, '1..*'),
      ],
      kanten: [
        { von: 'tn', nach: 'person', typ: 'generalisierung', vonSeite: 'oben', via: [[102.5, 170], [232.5, 170]], nachSeite: 'unten', hervor: true },
        { von: 'doz', nach: 'person', typ: 'generalisierung', vonSeite: 'oben', via: [[363.5, 170], [232.5, 170]], nachSeite: 'unten' },
        { von: 'doz', nach: 'kurs', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'leitet ▸', textVon: '1', textNach: '*' },
        { von: 'kurs', nach: 'zert', typ: 'realisierung', vonSeite: 'oben', nachSeite: 'unten', hervor: true },
        { von: 'kurs', nach: 'termin', typ: 'komposition', vonSeite: 'unten', nachSeite: 'oben', hervor: true },
      ],
    },
  },
  {
    id: 'kl-q2',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Aggregation, Komposition, Multiplizität',
    text: 'Entscheide für jedes Paar „Ganzes – Teil", ob eine Aggregation oder eine Komposition passt, und deute die Angaben.',
    felder: [
      { id: 'a', label: 'Rechnung – Rechnungsposition', optionen: OPT_GANZES, erwartet: 'Komposition' },
      { id: 'b', label: 'Playlist – Song', optionen: OPT_GANZES, erwartet: 'Aggregation' },
      { id: 'c', label: 'Gebäude – Raum', optionen: OPT_GANZES, erwartet: 'Komposition' },
      { id: 'd', label: 'Projektteam – Mitarbeiter', optionen: OPT_GANZES, erwartet: 'Aggregation' },
      {
        id: 'e',
        label: 'Wo sitzt die Raute?',
        optionen: ['Am Teil, z. B. an der Rechnungsposition', 'Am Ganzen, z. B. an der Rechnung', 'In der Mitte der Linie'],
        erwartet: 'Am Ganzen, z. B. an der Rechnung',
      },
      {
        id: 'f',
        label: 'Linie Mitarbeiter – Parkplatz, am Ende „Parkplatz" steht `0..1`. Was heißt das?',
        optionen: ['Ein Mitarbeiter hat mindestens einen Parkplatz.', 'Ein Mitarbeiter hat keinen oder genau einen Parkplatz.', 'Ein Mitarbeiter hat beliebig viele Parkplätze.'],
        erwartet: 'Ein Mitarbeiter hat keinen oder genau einen Parkplatz.',
      },
      {
        id: 'g',
        label: 'Linie Bestellung – Position, am Ende „Position" steht `1..*`. Was heißt das?',
        optionen: ['Eine Bestellung hat höchstens eine Position.', 'Eine Bestellung hat keine oder beliebig viele Positionen.', 'Eine Bestellung hat mindestens eine Position.'],
        erwartet: 'Eine Bestellung hat mindestens eine Position.',
      },
      { id: 'h', label: 'Sichtbarkeit für ein Attribut, das nur Klassen im selben Paket sehen dürfen', optionen: OPT_SICHT, erwartet: '~' },
    ],
    loesung: [
      'Prüffrage: **Kann das Teil ohne das Ganze sinnvoll weiterbestehen?** Nein → Komposition (volle Raute). Ja → Aggregation (hohle Raute).',
      'Eine Rechnungsposition ohne Rechnung ist sinnlos, ein Raum ohne Gebäude auch → Komposition. Wird das Ganze gelöscht, werden die Teile mitgelöscht.',
      'Ein Song bleibt im Bestand, wenn die Playlist gelöscht wird; ein Mitarbeiter bleibt im Betrieb, wenn das Team aufgelöst wird → Aggregation.',
      'Die Raute markiert das Ganze – sie sitzt deshalb immer an der Klasse, die die Teile enthält.',
      '`0..1` = keins oder eins, `1..*` = mindestens eins, `*` = beliebig viele (auch keins). Die Angabe gilt für die Klasse, an deren Ende sie steht.',
      '`~` (package) erlaubt den Zugriff nur aus demselben Paket, `#` (protected) für die eigene Klasse und ihre Unterklassen.',
    ],
  },

  // ---------- Zeichnen ----------
  {
    id: 'kl-z1',
    art: 'zeichnen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-3-2',
    titel: 'Ticketsystem im IT-Support',
    text: 'Ein IT-Dienstleister verwaltet Supporttickets. Zeichne ein Klassendiagramm mit zwei Klassen und ihrer Beziehung:\n- Ein **Ticket** hat eine Nummer (ganze Zahl), einen Betreff, ein Erstelldatum und die Angabe, ob es erledigt ist (ja/nein).\n- Ein Ticket kann **geschlossen** werden (keine Rückgabe), und man kann seinen **Betreff abfragen**.\n- Ein **Mitarbeiter** hat eine Personalnummer (ganze Zahl), einen Namen und eine E-Mail-Adresse.\n- Einem Mitarbeiter kann man ein Ticket **zuweisen**; außerdem liefert er die **Anzahl seiner offenen Tickets**.\n- Jedes Ticket wird von **genau einem** Mitarbeiter bearbeitet, ein Mitarbeiter bearbeitet **beliebig viele** Tickets.\n- Attribute sind privat, Methoden öffentlich.',
    muster: {
      breite: 700,
      hoehe: 190,
      knoten: [
        kl('ma', 20, 27.5, 'Mitarbeiter', ['- personalNr : int', '- name : String', '- email : String'], ['+ ticketZuweisen(ticket : Ticket) : void', '+ getAnzahlOffeneTickets() : int']),
        kl('ticket', 480, 20, 'Ticket', ['- ticketNr : int', '- betreff : String', '- erstelltAm : Date', '- erledigt : boolean'], ['+ schliessen() : void', '+ getBetreff() : String']),
      ],
      kanten: [{ von: 'ma', nach: 'ticket', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: 'bearbeitet ▸', textVon: '1', textNach: '*' }],
    },
    pruefliste: [
      'Zwei Klassen **Mitarbeiter** und **Ticket**, jede mit drei Bereichen: Name, Attribute, Methoden',
      'Alle Attribute mit `-` in der Form `name : Typ`',
      'Passende Typen: Nummern `int`, Texte `String`, Erstelldatum `Date`, erledigt `boolean`',
      'Alle Methoden mit `+`, Klammern und Rückgabetyp hinten, z. B. `+ schliessen() : void`',
      '`ticketZuweisen` hat einen Parameter vom Typ `Ticket` und gibt `void` zurück; die Anzahl kommt als `int` zurück',
      'Getter für den Betreff liefert `String`',
      'Assoziation zwischen beiden Klassen: **1** am Mitarbeiter, `*` am Ticket',
    ],
    hinweise: 'Namen dürfen abweichen (z. B. `nummer` statt `ticketNr`). Statt `Date` ist auch `LocalDate` richtig. Ein Name an der Linie („bearbeitet") ist gut, aber nicht Pflicht.',
  },
  {
    id: 'kl-z2',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Geräteverwaltung der IT-Abteilung',
    text: 'Die IT-Abteilung eines Betriebs verwaltet ihre Geräte. Zeichne ein Klassendiagramm mit allen Attributen (Sichtbarkeit, Name, Typ) und Methoden (Sichtbarkeit, Name, Parameter, Rückgabetyp):\n- Jedes **Gerät** hat eine Inventarnummer (z. B. „NB-0815"), ein Kaufdatum und einen Kaufpreis. Es gibt nur **Notebooks** und **Drucker**, kein „allgemeines" Gerät.\n- Jedes Gerät liefert seine Inventarnummer. Den **Restwert** berechnet jede Geräteart anders.\n- Ein Notebook hat zusätzlich die Akkukapazität in mAh (ganze Zahl).\n- Ein Drucker speichert, ob er farbig drucken kann, und die Seiten pro Minute.\n- Ein **Mitarbeiter** hat eine Personalnummer, einen Namen und eine **Liste** der ihm zugewiesenen Geräte. Man kann ihm ein Gerät zuweisen und die Anzahl seiner Geräte abfragen.\n- Die Unterklassen sollen direkt auf die Attribute von Gerät zugreifen können; alle anderen Attribute sind privat. Methoden sind öffentlich.',
    muster: {
      breite: 830,
      hoehe: 330,
      knoten: [
        kl('geraet', 160, 20, 'Geraet', ['# inventarNr : String', '# kaufdatum : Date', '# kaufpreis : double'], ['+ getInventarNr() : String', '*+ berechneRestwert() : double'], { abstrakt: true }),
        kl('nb', 20, 220, 'Notebook', ['- akkuKapazitaet : int'], ['+ berechneRestwert() : double']),
        kl('dr', 290, 220, 'Drucker', ['- farbdruck : boolean', '- seitenProMinute : int'], ['+ berechneRestwert() : double']),
        kl('ma', 545, 20, 'Mitarbeiter', ['- personalNr : int', '- name : String', '- geraete : List<Geraet>'], ['+ geraetZuweisen(g : Geraet) : void', '+ getAnzahlGeraete() : int']),
      ],
      kanten: [
        { von: 'nb', nach: 'geraet', typ: 'generalisierung', vonSeite: 'oben', via: [[130.5, 190], [270.5, 190]], nachSeite: 'unten' },
        { von: 'dr', nach: 'geraet', typ: 'generalisierung', vonSeite: 'oben', via: [[400.5, 190], [270.5, 190]], nachSeite: 'unten' },
      ],
    },
    pruefliste: [
      'Vier Klassen **Geraet**, **Notebook**, **Drucker**, **Mitarbeiter**, jede mit drei Bereichen',
      '**Geraet abstrakt**: Name kursiv (oder `{abstract}`), `berechneRestwert()` kursiv als abstrakte Methode',
      'Generalisierung Notebook → Geraet und Drucker → Geraet, **hohles Dreieck an Geraet**',
      'Attribute von Geraet mit `#`, alle übrigen Attribute mit `-`, alle Methoden mit `+`',
      'Passende Typen: `String` für die Inventarnummer, `Date` für das Kaufdatum, `double` für den Preis, `boolean` für Farbdruck, `int` für Akku und Seiten',
      'Notebook und Drucker überschreiben `+ berechneRestwert() : double`',
      'Mitarbeiter mit Liste `- geraete : List<Geraet>`',
      'Methoden `+ geraetZuweisen(g : Geraet) : void` und `+ getAnzahlGeraete() : int`',
    ],
    hinweise: '`getInventarNr()` wird vererbt und steht deshalb **nicht** noch einmal in den Unterklassen. Statt des Listen-Attributs darfst du auch eine Assoziation Mitarbeiter – Geraet mit `*` am Gerät zeichnen – dann entfällt das Attribut. `ArrayList<Geraet>` oder `Geraet[]` sind ebenfalls richtig.',
  },
  {
    id: 'kl-z3',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-1',
    titel: 'Hotel: Beziehungen ergänzen',
    text: 'Für ein Hotel sind zwei Klassen begonnen. Erweitere das Diagramm um Klassen, Beziehungen und Multiplizitäten (Attribute und Methoden der neuen Klassen in Auswahl):\n- Ein Hotel hat **mindestens ein** Zimmer. Zimmer gibt es nur als Teil ihres Hotels.\n- Eine **Buchung** gehört zu **genau einem** Gast; ein Gast kann **beliebig viele** Buchungen haben.\n- Eine Buchung umfasst **mindestens ein** Zimmer; ein Zimmer kommt in **beliebig vielen** Buchungen vor.\n- Gäste können zu **höchstens einer** **Reisegruppe** gehören. Eine Reisegruppe hat mindestens einen Gast. Löst sich die Gruppe auf, bleiben die Gäste im System.\n- Buchungen realisieren das Interface **Abrechenbar** mit der Methode `berechneBetrag()`, die den Betrag liefert.',
    vorlage: {
      breite: 910,
      hoehe: 150,
      knoten: [
        kl('hotel', 20, 20, 'Hotel', ['- name : String', '- sterne : int'], ['+ getFreieZimmer() : List<Zimmer>']),
        kl('zimmer', 380, 20, 'Zimmer', ['- nummer : int', '- preisProNacht : double'], ['+ istFrei(datum : Date) : boolean']),
      ],
      kanten: [],
    },
    muster: {
      breite: 910,
      hoehe: 495,
      knoten: [
        kl('hotel', 20, 20, 'Hotel', ['- name : String', '- sterne : int'], ['+ getFreieZimmer() : List<Zimmer>']),
        kl('zimmer', 380, 20, 'Zimmer', ['- nummer : int', '- preisProNacht : double'], ['+ istFrei(datum : Date) : boolean']),
        kl('buchung', 401, 230, 'Buchung', ['- anreise : Date', '- abreise : Date'], ['+ berechneBetrag() : double']),
        kl('gast', 40, 230, 'Gast', ['- name : String', '- email : String'], ['+ getName() : String']),
        kl('gruppe', 22.5, 400, 'Reisegruppe', ['- bezeichnung : String'], ['+ getAnzahlGaeste() : int']),
        mult('m-gruppe', 127, 372, '0..1'),
        kl('abr', 690, 230.5, 'Abrechenbar', [], ['+ berechneBetrag() : double'], { stereotyp: 'interface' }),
      ],
      kanten: [
        { von: 'hotel', nach: 'zimmer', typ: 'komposition', vonSeite: 'rechts', nachSeite: 'links', textVon: '1', textNach: '1..*' },
        { von: 'buchung', nach: 'zimmer', typ: 'assoziation', vonSeite: 'oben', nachSeite: 'unten', text: 'umfasst ▴', textVon: '*', textNach: '1..*' },
        { von: 'gast', nach: 'buchung', typ: 'assoziation', vonSeite: 'rechts', nachSeite: 'links', text: '◂ gehört zu', textVon: '1', textNach: '*' },
        { von: 'gruppe', nach: 'gast', typ: 'aggregation', vonSeite: 'oben', nachSeite: 'unten', textNach: '1..*', textSeite: -1 },
        { von: 'buchung', nach: 'abr', typ: 'realisierung', vonSeite: 'rechts', nachSeite: 'links' },
      ],
    },
    pruefliste: [
      '**Komposition** Hotel – Zimmer: **volle Raute am Hotel**, `1` am Hotel, `1..*` am Zimmer',
      'Neue Klassen **Buchung**, **Gast**, **Reisegruppe** mit sinnvollen Attributen und Methoden',
      'Assoziation Buchung – Gast: `1` am Gast, `*` an der Buchung',
      'Assoziation Buchung – Zimmer: `1..*` am Zimmer, `*` an der Buchung',
      '**Aggregation** Reisegruppe – Gast: **hohle Raute an der Reisegruppe**, `0..1` an der Reisegruppe, `1..*` am Gast',
      'Interface **«interface» Abrechenbar** mit `+ berechneBetrag() : double`',
      '**Realisierung** gestrichelt mit hohlem Dreieck von Buchung zu Abrechenbar; Buchung bietet `+ berechneBetrag() : double` an',
    ],
    hinweise: 'Warum hier zwei verschiedene Rauten? Zimmer gibt es ohne Hotel nicht → Komposition. Gäste bleiben, wenn sich die Reisegruppe auflöst → Aggregation. Die Raute sitzt in beiden Fällen am Ganzen.',
  },
];

export default { spickzettel, notation, aufgaben };
