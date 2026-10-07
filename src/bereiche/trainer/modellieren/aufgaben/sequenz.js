// Modus „Sequenzdiagramm" – Format: siehe ../README.md

export const spickzettel = `- **Lebenslinie**: Kopf \`objekt : Klasse\`, darunter gestrichelte Linie – die Zeit läuft **von oben nach unten**
- **Synchrone Nachricht**: durchgezogen, **volle Spitze** – der Sender wartet auf die Antwort; Beschriftung \`methode(parameter)\`
- **Asynchrone Nachricht**: durchgezogen, **offene Spitze** – der Sender arbeitet sofort weiter
- **Antwort**: **gestrichelt** mit offener Spitze zurück zum Aufrufer, beschriftet mit dem Rückgabewert
- **Selbstaufruf**: Pfeil, der auf die eigene Lebenslinie zurückführt; **Aktivierungsbalken** = Objekt arbeitet gerade
- **Fragmente**: \`alt\` (entweder – oder, Bereiche gestrichelt getrennt), \`opt\` (nur wenn), \`loop\` (wiederholen) – Wächter in **[eckigen Klammern]**
- **Erzeugen**: gestrichelter Pfeil «create» auf den **Kopf** des neuen Objekts; **Zerstören**: **X** am Ende der Lebenslinie`;

// Lebenslinie über ihre Mitte cx platzieren
const ll = (id, text, cx, y, laenge, aktiv = [], mehr = {}) => {
  const w = mehr.w ?? 130;
  return { id, typ: 'lebenslinie', x: cx - w / 2, y, w, text, laenge, aktiv, ...mehr };
};
const notiz = (id, x, y, text, anker = 'middle') => ({ id, typ: 'text', x, y, text, anker, klein: true });

const bildNachrichten = {
  breite: 840,
  hoehe: 390,
  knoten: [
    ll('k', 'k : Kasse', 90, 20, 320, [[70, 360]]),
    ll('s', 's : Saalplan', 310, 20, 320, [[85, 140]]),
    ll('t', 't : Ticket', 530, 228, 78, [], { zerstoert: 340 }),
    ll('d', 'd : Druckdienst', 750, 20, 320, [[295, 320]]),
    notiz('n1', 200, 100, 'synchron (volle Spitze)'),
    notiz('n2', 200, 154, 'Antwort (gestrichelt)'),
    notiz('n3', 139, 206, 'Selbstaufruf', 'start'),
    notiz('n4', 420, 309, 'asynchron (offene Spitze)'),
    notiz('n5', 548, 340, 'X = Objekt zerstört', 'start'),
  ],
  kanten: [
    { von: 'k', nach: 's', typ: 'nachricht', y: 85, text: 'pruefePlatz(reihe, platz)' },
    { von: 's', nach: 'k', typ: 'antwort', y: 140, text: 'true' },
    { von: 'k', nach: 'k', typ: 'nachricht', y: 175, text: 'berechnePreis()' },
    { von: 'k', nach: 't', typ: 'erzeugen', y: 245, text: '«create»' },
    { von: 'k', nach: 'd', typ: 'async', y: 295, text: 'drucke(ticket)' },
    { von: 'k', nach: 't', typ: 'nachricht', y: 340, text: '«destroy»' },
  ],
};

const bildFragmente = {
  breite: 840,
  hoehe: 475,
  rahmen: [
    { typ: 'fragment', x: 30, y: 70, w: 380, h: 90, art: 'loop', waechter: [{ x: 115, y: 88, text: '[für jede Position]' }] },
    {
      typ: 'fragment',
      x: 30,
      y: 180,
      w: 620,
      h: 160,
      art: 'alt',
      waechter: [
        { x: 115, y: 198, text: '[alle reserviert]' },
        { x: 115, y: 281, text: '[else]' },
      ],
      trenner: [265],
    },
    { typ: 'fragment', x: 30, y: 365, w: 790, h: 80, art: 'opt', waechter: [{ x: 115, y: 383, text: '[Kunde will Rechnung per E-Mail]' }] },
  ],
  knoten: [
    ll('b', 'b : Bestellung', 100, 20, 406, [[75, 450]]),
    ll('l', 'l : Lager', 340, 20, 406, [[115, 145]]),
    ll('z', 'z : Zahlung', 580, 20, 406, [[222, 247]]),
    ll('m', 'm : Mailserver', 760, 20, 406, [[420, 440]]),
  ],
  kanten: [
    { von: 'b', nach: 'l', typ: 'nachricht', y: 115, text: 'reserviere(artikelNr, menge)' },
    { von: 'l', nach: 'b', typ: 'antwort', y: 145, text: 'ok' },
    { von: 'b', nach: 'z', typ: 'nachricht', y: 222, text: 'buche(betrag)' },
    { von: 'z', nach: 'b', typ: 'antwort', y: 247, text: 'gebucht' },
    { von: 'b', nach: 'b', typ: 'nachricht', y: 300, text: 'storniere()' },
    { von: 'b', nach: 'm', typ: 'async', y: 420, text: 'sendeRechnung(email)' },
  ],
};

export const notation = {
  text: 'Oben stehen die beteiligten Objekte, darunter läuft die Zeit nach unten. Im ersten Bild prüft die Kasse beim Saalplan einen Platz und **wartet** auf die Antwort, berechnet selbst den Preis, **erzeugt** ein Ticket, schickt einen Druckauftrag **ohne zu warten** und **zerstört** das Ticket am Ende wieder. Im zweiten Bild siehst du die drei Fragmente: **loop** wiederholt, **alt** wählt genau einen Bereich, **opt** läuft nur, wenn der Wächter erfüllt ist.',
  bilder: [
    { titel: 'Nachrichten, Erzeugen und Zerstören', diagramm: bildNachrichten },
    { titel: 'Kombinierte Fragmente', diagramm: bildFragmente },
  ],
  punkte: [
    '**Volle Spitze** = synchron (Sender wartet), **offene Spitze** = asynchron (Sender wartet nicht), **gestrichelt** = Antwort.',
    'Nachrichten beschriftest du wie einen Methodenaufruf: `reserviere(artikelNr, menge)`. Die Antwort trägt den Rückgabewert, z. B. `true`.',
    'Ein **Selbstaufruf** führt auf dieselbe Lebenslinie zurück – das Objekt ruft eine eigene Methode auf.',
    '**alt** hat mehrere Bereiche mit je einem Wächter, getrennt durch eine gestrichelte Linie; `[else]` gilt, wenn kein anderer Wächter zutrifft. **opt** hat nur einen Bereich.',
    'Ein **neues Objekt** beginnt mit seinem Kopf auf Höhe der «create»-Nachricht, nicht oben. Ein **X** beendet die Lebenslinie – danach bekommt das Objekt keine Nachrichten mehr.',
  ],
};

const OPT_FRAG = ['alt', 'opt', 'loop'];
const OPT_PFEIL = ['synchrone Nachricht: durchgezogen, volle Spitze', 'asynchrone Nachricht: durchgezogen, offene Spitze', 'Antwort: gestrichelt, offene Spitze'];

// Diagramme der Fehler-Aufgaben (falsch und korrigiert)
const kinoFalsch = {
  breite: 720,
  hoehe: 380,
  rahmen: [
    {
      typ: 'fragment',
      x: 30,
      y: 145,
      w: 440,
      h: 152,
      art: 'opt',
      marke: 2,
      waechter: [
        { x: 115, y: 162, text: 'frei' },
        { x: 115, y: 244, text: '[else]' },
      ],
      trenner: [228],
    },
  ],
  knoten: [
    ll('k', 'k : Kasse', 90, 20, 311, [[70, 340]]),
    ll('s', 's : Saalplan', 330, 20, 311, [[85, 115], [190, 215]]),
    ll('d', 'd : Bondrucker', 600, 20, 311, [[327, 350]], { w: 140 }),
    { id: 'm4', typ: 'text', x: 156, y: 162, text: '', marke: 4 },
  ],
  kanten: [
    { von: 'k', nach: 's', typ: 'nachricht', y: 85, text: 'istFrei(reihe, platz)' },
    { von: 's', nach: 'k', typ: 'nachricht', y: 115, text: 'frei', marke: 1 },
    { von: 'k', nach: 's', typ: 'nachricht', y: 190, text: 'reserviere(reihe, platz)' },
    { von: 's', nach: 'k', typ: 'antwort', y: 215 },
    { von: 'k', nach: 'k', typ: 'nachricht', y: 262, text: 'zeigeHinweis()' },
    { von: 'k', nach: 'd', typ: 'async', y: 327, text: 'druckeBon(ticket)', marke: 3, textPos: 0.75 },
  ],
};

export const aufgaben = [
  {
    id: 'sq-e1',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Selbstverbuchung in der Bibliothek',
    text: 'Am Selbstverbuchungsterminal der Bibliothek legt ein Leser Ausweis und Medium auf. Das Terminal lässt zuerst den Ausweis von der Leserverwaltung prüfen und **wartet** auf das Ergebnis. Ist der Ausweis gültig, verbucht die Medienverwaltung die Ausleihe – auch hier **wartet** das Terminal – und liefert das Rückgabedatum. Sonst zeigt das Terminal selbst eine Fehlermeldung. Ergänze die Lücken und bestimme die Pfeilart an Stelle 4.',
    diagramm: {
      breite: 760,
      hoehe: 330,
      rahmen: [
        {
          typ: 'fragment',
          x: 30,
          y: 135,
          w: 700,
          h: 165,
          art: '{5}',
          waechter: [
            { x: 115, y: 152, text: '[gueltig]' },
            { x: 115, y: 240, text: '[{3}]' },
          ],
          trenner: [222],
        },
      ],
      knoten: [
        ll('t', 't : Terminal', 100, 20, 261, [[70, 300]]),
        ll('lv', 'lv : Leserverwaltung', 360, 20, 261, [[85, 115]], { w: 170 }),
        ll('mv', 'mv : Medienverwaltung', 620, 20, 261, [[180, 205]], { w: 170 }),
      ],
      kanten: [
        { von: 't', nach: 'lv', typ: 'nachricht', y: 85, text: '{1}' },
        { von: 'lv', nach: 't', typ: 'antwort', y: 115, text: '{2}' },
        { von: 't', nach: 'mv', typ: 'linie', y: 180, text: 'verbuche(mediumNr, ausweisNr)', marke: 4, textPos: 0.3 },
        { von: 'mv', nach: 't', typ: 'antwort', y: 205, text: 'rueckgabeDatum' },
        { von: 't', nach: 't', typ: 'nachricht', y: 262, text: 'zeigeFehler()' },
      ],
    },
    felder: [
      { id: '1', label: 'Beschriftung der ersten Nachricht', optionen: ['gueltig', 'pruefeAusweis(ausweisNr)', 'verbuche(mediumNr, ausweisNr)', 'zeigeFehler()'], erwartet: 'pruefeAusweis(ausweisNr)' },
      { id: '2', label: 'Beschriftung der Antwort', optionen: ['pruefeAusweis(ausweisNr)', 'rueckgabeDatum', 'gueltig'], erwartet: 'gueltig' },
      { id: '3', label: 'Wächter des zweiten Bereichs', optionen: ['loop', 'else', 'gueltig'], erwartet: 'else' },
      { id: '4', label: 'Pfeilart der Nachricht verbuche(…)', optionen: OPT_PFEIL, erwartet: 'synchrone Nachricht: durchgezogen, volle Spitze' },
      { id: '5', label: 'Art des Fragments', optionen: OPT_FRAG, erwartet: 'alt' },
    ],
    loesung: [
      '[1] Eine Nachricht ist ein Methodenaufruf beim Empfänger, beschriftet mit Name und Parametern: `pruefeAusweis(ausweisNr)`.',
      '[2] Die gestrichelte Antwort trägt den Rückgabewert – hier das Prüfergebnis `gueltig`, auf das sich der Wächter bezieht.',
      '[3] Der zweite Bereich gilt in allen übrigen Fällen → `[else]`.',
      '[4] Das Terminal **wartet** auf die Verbuchung → synchrone Nachricht mit voller Spitze. Die Antwort `rueckgabeDatum` kommt danach gestrichelt zurück.',
      '[5] Entweder wird verbucht oder ein Fehler gezeigt – genau ein Bereich von zweien → **alt**.',
    ],
  },
  {
    id: 'sq-e2',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Inventur im Lager',
    text: 'Bei der Inventur scannt ein Mitarbeiter nacheinander alle Artikel. Für **jeden** Artikel meldet der Scanner Artikelnummer und gezählte Menge an die Inventur. Die Inventur fragt beim Artikel den Sollbestand ab. **Nur wenn** die gezählte Menge vom Sollbestand abweicht, notiert die Inventur selbst eine Abweichung. Danach bestätigt sie dem Scanner. Ergänze die Lücken.',
    diagramm: {
      breite: 780,
      hoehe: 355,
      rahmen: [
        { typ: 'fragment', x: 30, y: 70, w: 720, h: 255, art: '{1}', waechter: [{ x: 115, y: 88, text: '[für jeden Artikel]' }] },
        { typ: 'fragment', x: 250, y: 195, w: 470, h: 85, art: '{4}', waechter: [{ x: 375, y: 213, text: '[{5}]' }] },
      ],
      knoten: [
        ll('s', 's : Scanner', 100, 20, 286, [[95, 315]]),
        ll('i', 'i : Inventur', 360, 20, 286, [[115, 305]]),
        ll('a', 'a : Artikel', 620, 20, 286, [[145, 175]]),
      ],
      kanten: [
        { von: 's', nach: 'i', typ: 'nachricht', y: 115, text: '{2}' },
        { von: 'i', nach: 'a', typ: 'nachricht', y: 145, text: 'getSollbestand()' },
        { von: 'a', nach: 'i', typ: 'antwort', y: 175, text: '{3}' },
        { von: 'i', nach: 'i', typ: 'nachricht', y: 240, text: 'notiere(artikelNr)' },
        { von: 'i', nach: 's', typ: 'antwort', y: 305, text: 'ok' },
      ],
    },
    felder: [
      { id: '1', label: 'Fragment außen', optionen: OPT_FRAG, erwartet: 'loop' },
      { id: '2', label: 'Nachricht vom Scanner an die Inventur', optionen: ['getSollbestand()', 'erfasse(artikelNr, menge)', 'sollbestand', 'notiere(artikelNr)'], erwartet: 'erfasse(artikelNr, menge)' },
      { id: '3', label: 'Antwort des Artikels', optionen: ['sollbestand', 'getSollbestand()', 'ok', 'erfasse(artikelNr, menge)'], erwartet: 'sollbestand' },
      { id: '4', label: 'Fragment innen', optionen: OPT_FRAG, erwartet: 'opt' },
      { id: '5', label: 'Wächter des inneren Fragments', optionen: ['menge == sollbestand', 'menge != sollbestand', 'für jeden Artikel'], erwartet: 'menge != sollbestand' },
    ],
    loesung: [
      '[1] „Für jeden Artikel" → der Ablauf wiederholt sich → **loop** mit dem Wächter `[für jeden Artikel]`.',
      '[2] Der Scanner übergibt, was er weiß: Artikelnummer und gezählte Menge → `erfasse(artikelNr, menge)`.',
      '[3] Auf `getSollbestand()` kommt gestrichelt der Rückgabewert `sollbestand` zurück.',
      '[4] „Nur wenn" mit **einem** Bereich und ohne Alternative → **opt**.',
      '[5] Notiert wird nur bei einer Abweichung → `[menge != sollbestand]`.',
    ],
  },
  {
    id: 'sq-e3',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Störung im Ticketsystem melden',
    text: 'Ein Mitarbeiter meldet über das Portal eine Störung. Die Ticketverwaltung **erzeugt** dafür ein neues Ticket-Objekt und setzt seine Priorität. Danach schickt sie eine Bestätigungsmail über den Mailserver – sie wartet **nicht**, bis die Mail verschickt ist. Das Portal bekommt die Ticketnummer zurück. Ergänze die Lücken.',
    diagramm: {
      breite: 850,
      hoehe: 330,
      knoten: [
        ll('p', 'p : Portal', 90, 20, 266, [[85, 280]]),
        ll('tv', 'tv : Ticketverwaltung', 320, 20, 266, [[85, 280]], { w: 170 }),
        ll('t', 't : Ticket', 550, 113, 173, [[175, 200]], { w: 120 }),
        ll('m', 'm : Mailserver', 760, 20, 266, [[240, 262]]),
      ],
      kanten: [
        { von: 'p', nach: 'tv', typ: 'nachricht', y: 85, text: 'meldeStoerung(text)' },
        { von: 'tv', nach: 't', typ: 'erzeugen', y: 130, text: '{1}' },
        { von: 'tv', nach: 't', typ: 'nachricht', y: 175, text: 'setzePrioritaet(stufe)' },
        { von: 't', nach: 'tv', typ: 'antwort', y: 200 },
        { von: 'tv', nach: 'm', typ: 'linie', y: 240, text: 'sendeBestaetigung(email)', marke: 2, textPos: 0.75 },
        { von: 'tv', nach: 'p', typ: 'antwort', y: 280, text: '{3}' },
      ],
    },
    felder: [
      { id: '1', label: 'Beschriftung des gestrichelten Pfeils auf den Kopf von t', optionen: ['«destroy»', '«create»', '«include»', 'else'], erwartet: '«create»' },
      { id: '2', label: 'Pfeilart der Nachricht sendeBestaetigung(email)', optionen: OPT_PFEIL, erwartet: 'asynchrone Nachricht: durchgezogen, offene Spitze' },
      { id: '3', label: 'Antwort an das Portal', optionen: ['meldeStoerung(text)', 'ticketNr', 'email', '«create»'], erwartet: 'ticketNr' },
      {
        id: 'x',
        label: 'Was würde ein X am Ende der Lebenslinie von t bedeuten?',
        optionen: ['Das Ticket wird zerstört und bekommt danach keine Nachrichten mehr.', 'Das Ticket wartet auf eine Antwort.', 'Das Ticket wird gerade erzeugt.'],
        erwartet: 'Das Ticket wird zerstört und bekommt danach keine Nachrichten mehr.',
      },
    ],
    loesung: [
      '[1] Ein neues Objekt entsteht mit einem gestrichelten Pfeil **auf seinen Kopf**, beschriftet mit «create». Deshalb steht der Kopf von t tiefer als die anderen.',
      '[2] Die Ticketverwaltung wartet **nicht** → asynchrone Nachricht mit offener Spitze und ohne Antwort.',
      '[3] Die Antwort trägt den Rückgabewert der ersten Nachricht: die Ticketnummer.',
      'Ein **X** auf der Lebenslinie zeigt, dass das Objekt zerstört wird – danach endet seine Lebenslinie.',
    ],
  },
  {
    id: 'sq-f1',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Fehler an der Kinokasse',
    text: 'An der Kinokasse wird ein Platz gebucht: Die Kasse fragt beim Saalplan, ob der Platz frei ist, und **wartet** auf die Antwort. Ist er frei, wird er reserviert, sonst zeigt die Kasse einen Hinweis. Zum Schluss wird der Bon gedruckt; die Kasse wartet **nicht** auf den Drucker. Prüfe die markierten Stellen 1–4.',
    diagramm: kinoFalsch,
    felder: [
      { id: '1', label: 'Rückmeldung „frei" vom Saalplan an die Kasse', optionen: ['korrekt', 'muss eine Antwort sein: gestrichelt, offene Spitze', 'muss asynchron sein', 'muss von links nach rechts zeigen'], erwartet: 'muss eine Antwort sein: gestrichelt, offene Spitze' },
      { id: '2', label: 'Fragment mit der Bezeichnung opt', optionen: ['korrekt', 'muss alt sein: zwei Bereiche mit [else]', 'muss loop sein', 'Fragmente dürfen keine Trennlinie haben'], erwartet: 'muss alt sein: zwei Bereiche mit [else]' },
      { id: '3', label: 'Nachricht druckeBon(ticket) an den Bondrucker', optionen: ['korrekt', 'muss synchron sein (volle Spitze)', 'muss gestrichelt sein', 'braucht eine Antwort'], erwartet: 'korrekt' },
      { id: '4', label: 'Wächter „frei"', optionen: ['korrekt', 'Wächter gehört in eckige Klammern: [frei]', 'Wächter steht hinter dem Pfeil', 'Wächter braucht «»'], erwartet: 'Wächter gehört in eckige Klammern: [frei]' },
    ],
    loesung: [
      '[1] Der Rückgabewert einer synchronen Nachricht kommt als **Antwort**: gestrichelte Linie mit offener Spitze.',
      '[2] Zwei Bereiche (reservieren **oder** Hinweis) mit `[else]` → **alt**. `opt` hat nur einen Bereich ohne Alternative.',
      '[3] Richtig: Die Kasse wartet nicht → asynchron mit offener Spitze, ohne Antwort.',
      '[4] Wächterbedingungen stehen immer in eckigen Klammern: `[frei]`.',
    ],
    muster: {
      ...kinoFalsch,
      rahmen: [
        {
          typ: 'fragment',
          x: 30,
          y: 145,
          w: 440,
          h: 152,
          art: 'alt',
          waechter: [
            { x: 115, y: 162, text: '[frei]' },
            { x: 115, y: 244, text: '[else]' },
          ],
          trenner: [228],
        },
      ],
      knoten: kinoFalsch.knoten.filter((k) => k.id !== 'm4'),
      kanten: kinoFalsch.kanten.map((k) => (k.marke === 1 ? { von: 's', nach: 'k', typ: 'antwort', y: 115, text: 'frei', hervor: true } : { ...k, marke: undefined })),
    },
  },
  {
    id: 'sq-f2',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Fehler in der Terminbuchung',
    text: 'In der Online-Terminbuchung einer Arztpraxis prüft der Terminservice zuerst selbst das Zeitfenster. Dann legt er einen **neuen** Termin an und lässt ihn vom Kalender eintragen; er **wartet** auf die Bestätigung. Danach wird die Sitzung des Patienten beendet und das Sitzungs-Objekt gelöscht. Prüfe die Stellen 1–4.',
    diagramm: {
      breite: 870,
      hoehe: 340,
      knoten: [
        ll('ts', 'ts : Terminservice', 100, 20, 266, [[75, 300]], { w: 150 }),
        ll('t', 't : Termin', 330, 20, 266, [], { w: 120, marke: 1 }),
        ll('k', 'k : Kalender', 560, 20, 266, [[175, 200]]),
        ll('s', 's : Sitzung', 780, 20, 246, [], { zerstoert: 245 }),
        { id: 'm3', typ: 'text', x: 306, y: 95, text: '', marke: 3 },
      ],
      kanten: [
        { von: 'ts', nach: 'ts', typ: 'nachricht', y: 85, text: 'pruefeZeitfenster(datum)' },
        { von: 'ts', nach: 't', typ: 'erzeugen', y: 130, text: '«create»' },
        { von: 'ts', nach: 'k', typ: 'async', y: 175, text: 'trageEin(t)', marke: 4, textPos: 0.25 },
        { von: 'k', nach: 'ts', typ: 'antwort', y: 200, text: 'ok' },
        { von: 'ts', nach: 's', typ: 'nachricht', y: 245, text: '«destroy»' },
        { von: 'ts', nach: 's', typ: 'nachricht', y: 285, text: 'getPatientId()', marke: 2 },
      ],
    },
    felder: [
      { id: '1', label: 'Kopf der Lebenslinie „t : Termin"', optionen: ['korrekt', 'muss auf Höhe der «create»-Nachricht stehen', 'muss ganz rechts stehen', 'neue Objekte haben keine Lebenslinie'], erwartet: 'muss auf Höhe der «create»-Nachricht stehen' },
      { id: '2', label: 'Nachricht getPatientId() an s', optionen: ['korrekt', 'unzulässig: s ist nach dem X bereits zerstört', 'muss asynchron sein', 'muss eine Antwort sein'], erwartet: 'unzulässig: s ist nach dem X bereits zerstört' },
      { id: '3', label: 'Selbstaufruf pruefeZeitfenster(datum)', optionen: ['korrekt', 'Selbstaufrufe sind nicht erlaubt', 'muss gestrichelt sein', 'braucht eine eigene Lebenslinie'], erwartet: 'korrekt' },
      { id: '4', label: 'Nachricht trageEin(t) an den Kalender', optionen: ['korrekt', 'muss synchron sein (volle Spitze), weil der Terminservice wartet', 'muss gestrichelt sein', 'muss «create» heißen'], erwartet: 'muss synchron sein (volle Spitze), weil der Terminservice wartet' },
    ],
    loesung: [
      '[1] Ein Objekt, das erst während des Ablaufs entsteht, beginnt **auf Höhe** seiner «create»-Nachricht. Der Pfeil zeigt auf den Kopf.',
      '[2] Nach dem **X** existiert das Objekt nicht mehr: keine weiteren Nachrichten, die Lebenslinie endet am X.',
      '[3] Richtig: Ein Objekt darf eigene Methoden aufrufen – der Pfeil führt auf die eigene Lebenslinie zurück.',
      '[4] Wer auf eine Bestätigung **wartet**, sendet synchron (volle Spitze). Die Antwort `ok` kommt gestrichelt zurück.',
    ],
    muster: {
      breite: 870,
      hoehe: 340,
      knoten: [
        ll('ts', 'ts : Terminservice', 100, 20, 266, [[75, 260]], { w: 150 }),
        ll('t', 't : Termin', 330, 113, 173, [], { w: 120, hervor: true }),
        ll('k', 'k : Kalender', 560, 20, 266, [[175, 200]]),
        ll('s', 's : Sitzung', 780, 20, 191, [], { zerstoert: 245 }),
      ],
      kanten: [
        { von: 'ts', nach: 'ts', typ: 'nachricht', y: 85, text: 'pruefeZeitfenster(datum)' },
        { von: 'ts', nach: 't', typ: 'erzeugen', y: 130, text: '«create»' },
        { von: 'ts', nach: 'k', typ: 'nachricht', y: 175, text: 'trageEin(t)', hervor: true },
        { von: 'k', nach: 'ts', typ: 'antwort', y: 200, text: 'ok' },
        { von: 'ts', nach: 's', typ: 'nachricht', y: 245, text: '«destroy»' },
      ],
    },
  },
  {
    id: 'sq-q1',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Welches Element passt?',
    text: 'Entscheide für jeden Satz aus einer Anforderung, wie du ihn im Sequenzdiagramm darstellst.',
    felder: [
      { id: 'a', label: 'Die Kasse fragt den Preis ab und wartet, bis er feststeht.', optionen: ['synchrone Nachricht', 'asynchrone Nachricht', 'Antwort'], erwartet: 'synchrone Nachricht' },
      { id: 'b', label: 'Das System stößt den E-Mail-Versand an und arbeitet sofort weiter.', optionen: ['synchrone Nachricht', 'asynchrone Nachricht', 'Antwort'], erwartet: 'asynchrone Nachricht' },
      { id: 'c', label: 'Der Saalplan meldet der Kasse „true" zurück.', optionen: ['synchrone Nachricht', 'asynchrone Nachricht', 'Antwort'], erwartet: 'Antwort' },
      { id: 'd', label: 'Nur wenn ein Gutschein vorliegt, wird er eingelöst.', optionen: OPT_FRAG, erwartet: 'opt' },
      { id: 'e', label: 'Für jede Position im Warenkorb wird der Preis ermittelt.', optionen: OPT_FRAG, erwartet: 'loop' },
      { id: 'f', label: 'Ist die Karte gedeckt, wird gebucht, sonst abgelehnt.', optionen: OPT_FRAG, erwartet: 'alt' },
      {
        id: 'g',
        label: 'Was bedeutet der Kopf „k : Kunde"?',
        optionen: ['Ein Objekt k der Klasse Kunde', 'Eine Klasse k mit dem Attribut Kunde', 'Ein Kunde, der die Methode k aufruft'],
        erwartet: 'Ein Objekt k der Klasse Kunde',
      },
    ],
    loesung: [
      '„wartet" → **synchron** (volle Spitze). „arbeitet sofort weiter" → **asynchron** (offene Spitze). Ein Rückgabewert → **Antwort** (gestrichelt).',
      '„nur wenn", „falls" ohne Alternative → **opt**.',
      '„für jede", „solange", „wiederholt" → **loop**.',
      '„wenn … sonst …" → **alt** mit zwei Bereichen, z. B. `[gedeckt]` und `[else]`.',
      'Im Kopf steht `objektname : Klasse` – eine Lebenslinie stellt immer ein Objekt dar, keine Klasse.',
    ],
  },
  {
    id: 'sq-q2',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Diagramm lesen: Pizza-Lieferdienst',
    text: 'Das Diagramm zeigt eine Bestellung in der App eines Pizza-Lieferdienstes. Beantworte die Fragen.',
    diagramm: {
      breite: 760,
      hoehe: 410,
      rahmen: [
        { typ: 'fragment', x: 30, y: 70, w: 420, h: 90, art: 'loop', waechter: [{ x: 105, y: 88, text: '[für jede Pizza]' }] },
        { typ: 'fragment', x: 30, y: 180, w: 420, h: 85, art: 'opt', waechter: [{ x: 105, y: 198, text: '[Gutscheincode eingegeben]' }] },
      ],
      knoten: [
        ll('a', 'a : App', 90, 20, 346, [[75, 390]]),
        ll('b', 'b : Bestellservice', 340, 20, 346, [[115, 140], [225, 250], [290, 380]], { w: 150 }),
        ll('k', 'k : Kueche', 610, 20, 346, [[355, 378]]),
      ],
      kanten: [
        { von: 'a', nach: 'b', typ: 'nachricht', y: 115, text: 'fuegeHinzu(pizzaNr)' },
        { von: 'b', nach: 'a', typ: 'antwort', y: 140 },
        { von: 'a', nach: 'b', typ: 'nachricht', y: 225, text: 'loeseEin(code)' },
        { von: 'b', nach: 'a', typ: 'antwort', y: 250, text: 'rabatt' },
        { von: 'a', nach: 'b', typ: 'nachricht', y: 290, text: 'bestellen()' },
        { von: 'b', nach: 'b', typ: 'nachricht', y: 315, text: 'berechneSumme()' },
        { von: 'b', nach: 'k', typ: 'async', y: 355, text: 'bereiteZu(bestellung)' },
        { von: 'b', nach: 'a', typ: 'antwort', y: 380, text: 'lieferzeit' },
      ],
    },
    felder: [
      { id: 'a', label: 'Wie oft wird fuegeHinzu(pizzaNr) gesendet?', optionen: ['genau einmal', 'einmal je Pizza', 'nur bei Gutscheincode'], erwartet: 'einmal je Pizza' },
      { id: 'b', label: 'Wer berechnet die Summe?', optionen: ['die App', 'der Bestellservice selbst (Selbstaufruf)', 'die Küche'], erwartet: 'der Bestellservice selbst (Selbstaufruf)' },
      { id: 'c', label: 'Wann wird loeseEin(code) gesendet?', optionen: ['bei jeder Bestellung', 'nur wenn ein Gutscheincode eingegeben wurde', 'einmal je Pizza'], erwartet: 'nur wenn ein Gutscheincode eingegeben wurde' },
      {
        id: 'd',
        label: 'Wartet der Bestellservice, bis die Küche fertig ist?',
        optionen: ['Ja – bereiteZu ist synchron.', 'Nein – bereiteZu ist asynchron (offene Spitze).', 'Ja – die Küche schickt lieferzeit zurück.'],
        erwartet: 'Nein – bereiteZu ist asynchron (offene Spitze).',
      },
      { id: 'e', label: 'Was bekommt die App auf bestellen() zurück?', optionen: ['rabatt', 'lieferzeit', 'bestellung'], erwartet: 'lieferzeit' },
    ],
    loesung: [
      '**loop** mit `[für jede Pizza]` → `fuegeHinzu(pizzaNr)` wird einmal je Pizza gesendet.',
      'Der Pfeil von `berechneSumme()` führt auf die Lebenslinie des Bestellservice zurück → Selbstaufruf.',
      '**opt** läuft nur, wenn der Wächter `[Gutscheincode eingegeben]` gilt.',
      'Die offene Spitze bei `bereiteZu(bestellung)` heißt asynchron: Der Bestellservice wartet nicht und antwortet der App gleich mit `lieferzeit`.',
      'Die gestrichelte Antwort `lieferzeit` vom Bestellservice an die App gehört zum letzten Aufruf `bestellen()`.',
    ],
  },

  // ---------- Zeichnen ----------
  {
    id: 'sq-z1',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Kassenautomat im Parkhaus',
    text: 'Zeichne ein Sequenzdiagramm für den Kassenautomaten eines Parkhauses mit den Lebenslinien `a : Kassenautomat`, `t : Ticketverwaltung` und `z : Zahlungsdienst`:\n- Der Automat fragt die Ticketverwaltung mit `ermittleParkdauer(ticketNr)` nach der Parkdauer und **wartet** auf die Antwort `dauer`.\n- Er berechnet **selbst** die Gebühr mit `berechneGebuehr(dauer)`.\n- Zahlt der Kunde **mit Karte**, schickt der Automat `belasteKarte(kartenNr, betrag)` an den Zahlungsdienst und wartet auf die Antwort `ok`. **Sonst** nimmt er selbst Bargeld an: `nimmBargeld(betrag)`.\n- Zum Schluss meldet er `markiereBezahlt(ticketNr)` an die Ticketverwaltung, **ohne** auf eine Antwort zu warten.',
    muster: {
      breite: 740,
      hoehe: 410,
      rahmen: [
        {
          typ: 'fragment',
          x: 30,
          y: 190,
          w: 690,
          h: 150,
          art: 'alt',
          waechter: [
            { x: 115, y: 207, text: '[Kartenzahlung]' },
            { x: 115, y: 290, text: '[else]' },
          ],
          trenner: [272],
        },
      ],
      knoten: [
        ll('a', 'a : Kassenautomat', 100, 20, 346, [[75, 385]], { w: 150 }),
        ll('t', 't : Ticketverwaltung', 360, 20, 346, [[85, 115], [370, 392]], { w: 170 }),
        ll('z', 'z : Zahlungsdienst', 620, 20, 346, [[232, 257]], { w: 160 }),
      ],
      kanten: [
        { von: 'a', nach: 't', typ: 'nachricht', y: 85, text: 'ermittleParkdauer(ticketNr)' },
        { von: 't', nach: 'a', typ: 'antwort', y: 115, text: 'dauer' },
        { von: 'a', nach: 'a', typ: 'nachricht', y: 145, text: 'berechneGebuehr(dauer)' },
        { von: 'a', nach: 'z', typ: 'nachricht', y: 232, text: 'belasteKarte(kartenNr, betrag)' },
        { von: 'z', nach: 'a', typ: 'antwort', y: 257, text: 'ok' },
        { von: 'a', nach: 'a', typ: 'nachricht', y: 305, text: 'nimmBargeld(betrag)' },
        { von: 'a', nach: 't', typ: 'async', y: 370, text: 'markiereBezahlt(ticketNr)' },
      ],
    },
    pruefliste: [
      'Drei Lebenslinien mit Kopf `name : Klasse` und gestrichelter Linie; Nachrichten in zeitlicher Reihenfolge von oben nach unten',
      '`ermittleParkdauer(ticketNr)` **synchron** (volle Spitze) zur Ticketverwaltung, Antwort `dauer` **gestrichelt** zurück',
      '`berechneGebuehr(dauer)` als **Selbstaufruf** am Automaten',
      '**alt**-Fragment mit zwei Bereichen, gestrichelter Trennlinie und Wächtern `[Kartenzahlung]` und `[else]`',
      'Im ersten Bereich `belasteKarte(kartenNr, betrag)` synchron an den Zahlungsdienst und Antwort `ok`',
      'Im zweiten Bereich Selbstaufruf `nimmBargeld(betrag)`',
      '`markiereBezahlt(ticketNr)` **asynchron** (offene Spitze) und ohne Antwort, nach dem alt-Fragment',
    ],
    hinweise: 'Aktivierungsbalken sind gut, aber nicht Pflicht. Statt `[else]` ist auch `[Barzahlung]` richtig.',
  },
  {
    id: 'sq-z2',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-4',
    titel: 'Anmeldung am Ticketsystem',
    text: 'Das Diagramm zeigt den Beginn der Anmeldung am Ticketsystem. Erweitere es:\n- Ist das Passwort richtig, **erzeugt** die Anmeldung ein Objekt `s : Sitzung`.\n- Danach antwortet die Anmeldung dem Portal mit `erfolg`.\n- Das Portal lädt mit `ladeTickets(benutzerId)` die Tickets des Benutzers bei der Ticketverwaltung und erhält `tickets` zurück.\n- **Für jedes Ticket** ruft das Portal selbst `zeigeAn(ticket)` auf.\n- Beim Abmelden schickt das Portal `abmelden()` an die Anmeldung. Diese **zerstört** die Sitzung.',
    vorlage: {
      breite: 860,
      hoehe: 170,
      knoten: [
        ll('p', 'p : Portal', 90, 20, 100, [[75, 154]]),
        ll('an', 'an : Anmeldung', 320, 20, 100, [[85, 154]], { w: 140 }),
        ll('tv', 'tv : Ticketverwaltung', 760, 20, 100, [], { w: 170 }),
      ],
      kanten: [
        { von: 'p', nach: 'an', typ: 'nachricht', y: 85, text: 'anmelden(name, passwort)' },
        { von: 'an', nach: 'an', typ: 'nachricht', y: 110, text: 'pruefePasswort(passwort)' },
      ],
    },
    muster: {
      breite: 860,
      hoehe: 500,
      rahmen: [
        { typ: 'fragment', x: 230, y: 150, w: 380, h: 80, art: 'opt', waechter: [{ x: 375, y: 168, text: '[Passwort richtig]' }] },
        { typ: 'fragment', x: 30, y: 330, w: 260, h: 75, art: 'loop', waechter: [{ x: 105, y: 348, text: '[für jedes Ticket]' }] },
      ],
      knoten: [
        ll('p', 'p : Portal', 90, 20, 436, [[75, 450]]),
        ll('an', 'an : Anmeldung', 320, 20, 436, [[85, 260], [435, 475]], { w: 140 }),
        ll('s', 's : Sitzung', 540, 183, 248, [], { w: 120, zerstoert: 465 }),
        ll('tv', 'tv : Ticketverwaltung', 760, 20, 436, [[285, 310]], { w: 170 }),
      ],
      kanten: [
        { von: 'p', nach: 'an', typ: 'nachricht', y: 85, text: 'anmelden(name, passwort)' },
        { von: 'an', nach: 'an', typ: 'nachricht', y: 110, text: 'pruefePasswort(passwort)' },
        { von: 'an', nach: 's', typ: 'erzeugen', y: 200, text: '«create»' },
        { von: 'an', nach: 'p', typ: 'antwort', y: 250, text: 'erfolg' },
        { von: 'p', nach: 'tv', typ: 'nachricht', y: 285, text: 'ladeTickets(benutzerId)' },
        { von: 'tv', nach: 'p', typ: 'antwort', y: 310, text: 'tickets' },
        { von: 'p', nach: 'p', typ: 'nachricht', y: 370, text: 'zeigeAn(ticket)' },
        { von: 'p', nach: 'an', typ: 'nachricht', y: 435, text: 'abmelden()' },
        { von: 'an', nach: 's', typ: 'nachricht', y: 465, text: '«destroy»' },
      ],
    },
    pruefliste: [
      '**opt**-Fragment mit Wächter `[Passwort richtig]` um das Erzeugen der Sitzung',
      '«create»-Pfeil **gestrichelt** auf den **Kopf** von `s : Sitzung`; der Kopf steht auf Höhe dieser Nachricht, nicht oben',
      'Antwort `erfolg` gestrichelt von der Anmeldung zum Portal',
      '`ladeTickets(benutzerId)` synchron zur Ticketverwaltung, Antwort `tickets` gestrichelt zurück',
      '**loop**-Fragment mit Wächter `[für jedes Ticket]` um den Selbstaufruf `zeigeAn(ticket)`',
      '`abmelden()` vom Portal an die Anmeldung, danach Nachricht an die Sitzung, die sie zerstört (z. B. «destroy»)',
      'Lebenslinie der Sitzung endet mit einem **X**',
    ],
    hinweise: 'Die Antwort `erfolg` darf auch direkt nach dem opt-Fragment stehen, solange sie nach `pruefePasswort` kommt. Statt «destroy» ist auch ein Methodenname wie `beenden()` mit X am Ende richtig.',
  },
];

export default { spickzettel, notation, aufgaben };
