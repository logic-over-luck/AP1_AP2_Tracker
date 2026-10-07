// Modus „zustand" – Format: siehe ../README.md

import { masse } from '../geometrie.js';

// Knoten über ihren Mittelpunkt setzen – so liegen Pfeile ohne Rechnen senkrecht oder waagerecht.
const um = (k, cx, cy) => {
  const m = masse({ ...k, x: 0, y: 0 });
  return { ...k, x: cx - m.w / 2, y: cy - m.h / 2 };
};
const start = (id, cx, cy) => um({ id, typ: 'start' }, cx, cy);
const ende = (id, cx, cy, extra) => um({ id, typ: 'ende', ...extra }, cx, cy);
const zu = (id, cx, cy, name, intern, extra) => um({ id, typ: 'zustand', name, ...(intern ? { intern } : {}), ...extra }, cx, cy);
const notiz = (id, x, y, text, anker = 'start') => ({ id, typ: 'text', x, y, text, anker, klein: true });
const f = (von, nach, text, extra) => ({ von, nach, typ: 'fluss', ...(text ? { text } : {}), ...extra });

export const spickzettel = `- **Zustand** (Rechteck mit runden Ecken): eine Lage, in der das Objekt eine Weile ist – „Offen", „Gesperrt", „In Bearbeitung"
- **Startzustand** (gefüllter Kreis) zeigt auf den ersten Zustand; **Endzustand** (Kreis mit Punkt) beendet den Lebenszyklus
- **Übergang** (Pfeil): \`Auslöser [Bedingung] / Aktion\` – jeder Teil darf fehlen, die Reihenfolge bleibt
- Im Zustand: \`entry /\` einmal beim Betreten, \`do /\` solange der Zustand gilt, \`exit /\` einmal beim Verlassen
- Gleicher Auslöser, mehrere Ziele: Bedingungen **lückenlos und ohne Überschneidung**, z. B. [betrag < 50] und [betrag >= 50]
- **Zeitereignis**: \`after(30 s)\` schaltet, wenn das Objekt 30 s im Zustand war
- **Rücksprung** in einen früheren Zustand ist ein normaler Übergang – entry läuft dann erneut`;

// ---------- Notation ----------

const notationDiagramm = {
  breite: 840,
  hoehe: 400,
  knoten: [
    start('s', 300, 24),
    zu('wartend', 300, 90, 'Wartend', ['entry / Position anzeigen']),
    zu('druckend', 300, 230, 'Druckend', ['entry / Seiten an Drucker senden', 'do / Seiten drucken', 'exit / Seitenzähler speichern']),
    zu('angehalten', 720, 230, 'Angehalten', ['do / Warnlampe blinken lassen']),
    ende('e', 300, 370),
    notiz('n1', 284, 24, 'Startzustand', 'end'),
    notiz('n2', 284, 370, 'Endzustand', 'end'),
    notiz('n3', 90, 230, 'Zustand mit\nentry / do / exit', 'middle'),
    notiz('n4', 590, 182, 'Übergang: Auslöser / Aktion', 'middle'),
    notiz('n6', 590, 274, 'Rücksprung', 'middle'),
    notiz('n5', 732, 320, 'Zeitereignis'),
  ],
  kanten: [
    f('s', 'wartend'),
    f('wartend', 'druckend', 'Drucker frei [Papier vorhanden]'),
    f('druckend', 'angehalten', 'Papier leer / Hinweis anzeigen', { vonSeite: 'rechts:-15', nachSeite: 'links:-15' }),
    f('angehalten', 'druckend', 'Papier nachgefüllt', { vonSeite: 'links:15', nachSeite: 'rechts:15', textSeite: -1 }),
    f('druckend', 'e', 'letzte Seite gedruckt / Benutzer informieren'),
    f('angehalten', 'e', 'after(10 min) / Auftrag verwerfen', { vonSeite: 'unten', via: [[720, 370]], nachSeite: 'rechts', textPos: 0.55 }),
  ],
};

export const notation = {
  text: 'So liest du das Diagramm (ein Druckauftrag): Der Auftrag ist zuerst **Wartend**. Ist der Drucker frei **und** Papier vorhanden, wechselt er nach **Druckend** – dabei werden beim Betreten (entry) die Seiten gesendet, solange er druckt (do) wird gedruckt, beim Verlassen (exit) wird der Zähler gespeichert. Ist das Papier leer, wird er **Angehalten** und springt nach dem Nachfüllen **zurück**. Bleibt er 10 Minuten angehalten, wird er verworfen.',
  diagramm: notationDiagramm,
  punkte: [
    'Übergänge beschriftest du immer in der Reihenfolge **Auslöser [Bedingung] / Aktion**. Der Übergang schaltet nur, wenn der Auslöser eintritt **und** die Bedingung wahr ist; die Aktion läuft beim Wechsel.',
    '**entry** läuft einmal beim Betreten, **exit** einmal beim Verlassen, **do** so lange, wie der Zustand besteht.',
    'Hat ein Auslöser mehrere Übergänge, müssen die Bedingungen **alle** Fälle abdecken und sich **ausschließen**: [betrag < 50] / [betrag >= 50] – nicht [betrag < 50] / [betrag > 50].',
    '**after(10 min)** ist ein Zeitereignis: Der Übergang schaltet, wenn das Objekt 10 Minuten ununterbrochen im Zustand war.',
    'Ein **Rücksprung** (Angehalten → Druckend) ist ein ganz normaler Übergang. Beim erneuten Betreten läuft entry wieder.',
    'Zustandsnamen beschreiben eine Lage („Gesperrt", „Wartet auf Kunde"), keine Tätigkeit. Tätigkeiten stehen als Aktion am Übergang oder als entry/do/exit im Zustand.',
  ],
};

// ---------- Aufgaben ----------

const OPT_EDX = ['entry', 'do', 'exit'];

export const aufgaben = [
  {
    id: 'zu-e1',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Ticket im IT-Support',
    text: 'Ein neues Ticket ist **Neu**. Übernimmt ein Supporter es, ist es **in Bearbeitung**. Fehlen Angaben, sendet er eine Rückfrage, und das Ticket **wartet auf den Kunden**, bis dieser antwortet – dann ist es wieder in Bearbeitung. Ist die Störung behoben, ist das Ticket **Gelöst**, und der Kunde wird informiert. Bestätigt der Kunde, endet das Ticket. Meldet er sich 7 Tage lang nicht, endet es ebenfalls. Besteht das Problem weiter, geht es zurück in Bearbeitung. Ergänze die Lücken.',
    diagramm: {
      breite: 960,
      hoehe: 300,
      knoten: [
        start('s', 40, 70),
        zu('neu', 160, 70, 'Neu'),
        zu('bearb', 450, 70, '{1}', null, { w: 170 }),
        zu('warten', 450, 230, 'Wartet auf Kunde', null, { w: 170 }),
        zu('geloest', 820, 70, 'Gelöst', null, { w: 130 }),
        ende('e', 820, 240),
      ],
      kanten: [
        f('s', 'neu'),
        f('neu', 'bearb', 'Ticket übernommen'),
        f('bearb', 'warten', 'Angaben fehlen / Rückfrage senden', { vonSeite: 'unten:-40', nachSeite: 'oben:-40', textSeite: -1 }),
        f('warten', 'bearb', '{2}', { vonSeite: 'oben:40', nachSeite: 'unten:40' }),
        f('bearb', 'geloest', 'behoben / {3}', { vonSeite: 'rechts:-12', nachSeite: 'links:-12' }),
        f('geloest', 'bearb', 'Problem besteht weiter', { vonSeite: 'links:12', nachSeite: 'rechts:12', textSeite: -1 }),
        f('geloest', 'e', 'Kunde bestätigt', { vonSeite: 'unten:-30', via: [[790, 240]], nachSeite: 'links', textSeite: -1 }),
        f('geloest', 'e', '{4}', { vonSeite: 'unten:30', via: [[850, 240]], nachSeite: 'rechts' }),
      ],
    },
    felder: [
      { id: '1', label: 'Name des Zustands', optionen: ['Gelöst', 'In Bearbeitung', 'Supporter', 'Ticketsystem'], erwartet: 'In Bearbeitung' },
      { id: '2', label: 'Auslöser für den Rücksprung', optionen: ['Angaben fehlen', 'after(7 Tage)', 'Kunde antwortet', 'Ticket übernommen'], erwartet: 'Kunde antwortet' },
      { id: '3', label: 'Aktion beim Wechsel nach „Gelöst"', optionen: ['Kunden informieren', 'Kunde bestätigt', 'Problem besteht weiter', 'Gelöst'], erwartet: 'Kunden informieren' },
      { id: '4', label: 'Übergang, wenn sich der Kunde nicht meldet', optionen: ['[7 Tage]', 'after(7 Tage)', 'do / 7 Tage warten', 'Kunde bestätigt'], erwartet: 'after(7 Tage)' },
    ],
    loesung: [
      '[1] Ein Zustand beschreibt eine **Lage** des Objekts. „Supporter" ist eine Person, „Ticketsystem" das System – beides keine Zustände eines Tickets.',
      '[2] Der Rücksprung schaltet, wenn das Ereignis „Kunde antwortet" eintritt. Ein Rücksprung ist ein normaler Übergang zurück in einen früheren Zustand.',
      '[3] Hinter dem Schrägstrich steht die **Aktion**, die beim Wechsel ausgeführt wird: Der Kunde wird informiert.',
      '[4] Eine abgelaufene Zeit schreibst du als Zeitereignis **after(…)**. Eine Bedingung in eckigen Klammern ist kein Auslöser.',
    ],
  },
  {
    id: 'zu-e2',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Getränkeautomat',
    text: 'Der Automat ist **Bereit**. Wählt der Kunde ein Getränk, wechselt er in **Geld sammeln** und zeigt den Preis an. Bei jedem Münzeinwurf ist `guthaben` schon um die neue Münze erhöht. Ist das Guthaben noch **kleiner** als der Preis, bleibt er in Geld sammeln. **Erreicht oder übersteigt** es den Preis, gibt er das Getränk aus und wechselt in **Ausgabe**. Beim Verlassen der Ausgabe gibt er das Wechselgeld zurück; nach 5 Sekunden ist er wieder bereit. „Abbrechen" gibt das Geld zurück. Ergänze die Lücken.',
    diagramm: {
      breite: 800,
      hoehe: 350,
      knoten: [
        start('s', 40, 120),
        zu('bereit', 150, 120, 'Bereit'),
        zu('sammeln', 490, 120, 'Geld sammeln', ['entry / Preis anzeigen'], { w: 180 }),
        zu('ausgabe', 490, 290, 'Ausgabe', ['{3} / Wechselgeld zurückgeben'], { w: 220 }),
      ],
      kanten: [
        f('s', 'bereit'),
        f('bereit', 'sammeln', 'Getränk gewählt', { vonSeite: 'rechts:-10', nachSeite: 'links:-10' }),
        f('sammeln', 'bereit', 'Abbrechen / Geld zurückgeben', { vonSeite: 'links:10', nachSeite: 'rechts:10', textSeite: -1 }),
        f('sammeln', 'sammeln', 'Münze eingeworfen [{1}]', { vonSeite: 'oben:-40', via: [[450, 50], [530, 50]], nachSeite: 'oben:40' }),
        f('sammeln', 'ausgabe', 'Münze eingeworfen [{2}]\n/ Getränk ausgeben'),
        f('ausgabe', 'bereit', '{4}', { vonSeite: 'links', via: [[150, 290]], nachSeite: 'unten', textPos: 0.3 }),
      ],
    },
    felder: [
      { id: '1', label: 'Bedingung zum Weitersammeln', optionen: ['guthaben <= preis', 'guthaben < preis', 'guthaben > preis', 'guthaben = 0'], erwartet: 'guthaben < preis' },
      { id: '2', label: 'Bedingung zur Ausgabe', optionen: ['guthaben > preis', 'guthaben = preis', 'guthaben >= preis', 'guthaben < preis'], erwartet: 'guthaben >= preis' },
      { id: '3', label: 'Schlüsselwort für „Wechselgeld zurückgeben"', optionen: OPT_EDX, erwartet: 'exit' },
      { id: '4', label: 'Übergang von „Ausgabe" zu „Bereit"', optionen: ['after(5 s)', '[5 s]', 'do / 5 s warten', 'Getränk gewählt'], erwartet: 'after(5 s)' },
    ],
    loesung: [
      '[1] und [2] Derselbe Auslöser „Münze eingeworfen" führt in zwei Richtungen. Die Bedingungen müssen sich ergänzen: [guthaben < preis] und [guthaben >= preis]. Mit <= und >= würde „genau passend" in beide Zweige fallen, mit < und > in keinen.',
      'Der Übergang zurück in denselben Zustand (Selbstübergang) zeigt: Der Automat bleibt in Geld sammeln und wartet auf die nächste Münze.',
      '[3] Aktionen beim **Verlassen** eines Zustands stehen mit **exit** im Zustand.',
      '[4] Nach Ablauf einer Zeit im Zustand schaltet ein Zeitereignis: **after(5 s)**.',
    ],
  },
  {
    id: 'zu-e3',
    art: 'ergaenzen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Akkuladegerät',
    text: 'Das Ladegerät ist **Bereit**. Wird ein Akku eingelegt, prüft es die Temperatur `temp`: Bei **höchstens 45 °C** beginnt das **Laden**, bei **mehr als 45 °C** geht es in **Störung** und gibt einen Warnton aus. Beim Betreten von Laden schaltet es die LED rot ein, **solange** es lädt, speist es Strom ein, beim Verlassen schaltet es die LED aus. Ist der Akku voll, wechselt es in **Erhaltungsladung**. Wird der Akku entnommen, ist das Gerät wieder bereit. Ergänze die Lücken.',
    diagramm: {
      breite: 800,
      hoehe: 380,
      knoten: [
        start('s', 60, 80),
        zu('bereit', 220, 80, 'Bereit', null, { w: 140 }),
        zu('laden', 600, 80, 'Laden', ['{2} / LED rot einschalten', '{3} / Strom einspeisen', 'exit / LED ausschalten'], { w: 200 }),
        zu('erhalt', 600, 250, 'Erhaltungsladung', ['entry / LED grün einschalten']),
        zu('stoerung', 220, 330, 'Störung', ['do / LED rot blinken'], { w: 160 }),
      ],
      kanten: [
        f('s', 'bereit'),
        f('bereit', 'laden', 'Akku eingelegt [temp <= 45 °C]'),
        f('laden', 'erhalt', 'Akku voll'),
        f('erhalt', 'bereit', 'Akku entnommen', { vonSeite: 'rechts', via: [[765, 250], [765, 20], [220, 20]], nachSeite: 'oben', textPos: 0.68 }),
        f('bereit', 'stoerung', 'Akku eingelegt\n[{1}]\n/ Warnton ausgeben', { vonSeite: 'unten:-30', nachSeite: 'oben:-30', textSeite: -1 }),
        f('stoerung', 'bereit', 'Akku entnommen', { vonSeite: 'oben:30', nachSeite: 'unten:30' }),
      ],
    },
    felder: [
      { id: '1', label: 'Bedingung zur Störung', optionen: ['temp >= 45 °C', 'temp > 45 °C', 'temp < 45 °C', 'temp = 45 °C'], erwartet: 'temp > 45 °C' },
      { id: '2', label: 'Schlüsselwort für „LED rot einschalten"', optionen: OPT_EDX, erwartet: 'entry' },
      { id: '3', label: 'Schlüsselwort für „Strom einspeisen"', optionen: OPT_EDX, erwartet: 'do' },
      {
        id: 'a',
        label: 'Wie lange speist das Gerät Strom ein?',
        optionen: ['nur einmal beim Betreten von „Laden"', 'solange es im Zustand „Laden" ist', 'erst beim Verlassen von „Laden"', 'dauerhaft, auch in „Bereit"'],
        erwartet: 'solange es im Zustand „Laden" ist',
      },
    ],
    loesung: [
      '[1] Zu [temp <= 45 °C] gehört als Gegenstück [temp > 45 °C]. Mit >= läge genau 45 °C in beiden Bedingungen – der Ablauf wäre nicht eindeutig.',
      '[2] „Beim Betreten" → **entry**: läuft genau einmal, wenn der Zustand erreicht wird.',
      '[3] „Solange es lädt" → **do**: läuft, solange der Zustand besteht, und endet beim Verlassen.',
      '(a) Eine do-Aktivität dauert an, bis der Zustand verlassen wird – hier durch „Akku voll".',
    ],
  },
  {
    id: 'zu-f1',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Benutzerkonto mit Sperre',
    text: 'Ein Konto ist **Abgemeldet**. Bei korrektem Passwort wird es **Angemeldet**, und der Fehlerzähler wird zurückgesetzt; beim Betreten wird die Startseite angezeigt. Bei falschem Passwort wird der Zähler erhöht. Beim **dritten** Fehlversuch in Folge wird das Konto **Gesperrt** und der Admin informiert. Nach 30 Minuten wird die Sperre aufgehoben und der Zähler zurückgesetzt. Abmelden führt zurück zu Abgemeldet. `fehler` ist der Zählerstand **vor** dem aktuellen Versuch. Prüfe die Stellen 1–4.',
    diagramm: {
      breite: 720,
      hoehe: 350,
      knoten: [
        start('s', 50, 120),
        zu('ab', 220, 120, 'Abgemeldet', null, { w: 140 }),
        zu('an', 600, 120, 'Angemeldet', ['exit / Startseite anzeigen'], { marke: 2 }),
        zu('gesperrt', 220, 300, 'Gesperrt', ['entry / Sperrhinweis anzeigen']),
        ende('e', 600, 260),
      ],
      kanten: [
        f('s', 'ab'),
        f('ab', 'ab', 'Passwort falsch [fehler < 2] / fehler erhöhen', { vonSeite: 'oben:-40', via: [[180, 50], [260, 50]], nachSeite: 'oben:40' }),
        f('ab', 'an', 'Passwort korrekt / fehler = 0'),
        f('an', 'e', 'Abmelden', { marke: 4 }),
        f('ab', 'gesperrt', 'Passwort falsch\n[fehler > 2]\n/ Admin informieren', { vonSeite: 'unten:-30', nachSeite: 'oben:-30', textSeite: -1, textPos: 0.4, marke: 1 }),
        f('gesperrt', 'ab', 'after(30 min)\n/ fehler = 0', { vonSeite: 'oben:30', nachSeite: 'unten:30', textPos: 0.4, marke: 3 }),
      ],
    },
    felder: [
      { id: '1', label: 'Bedingung [fehler > 2] zum Sperren', optionen: ['korrekt', 'Überschneidung mit [fehler < 2]', 'Lücke bei fehler = 2 – richtig: [fehler >= 2]', 'Bedingung muss vor dem Auslöser stehen'], erwartet: 'Lücke bei fehler = 2 – richtig: [fehler >= 2]' },
      { id: '2', label: '„exit / Startseite anzeigen" in „Angemeldet"', optionen: ['korrekt', 'muss entry sein', 'muss do sein', 'gehört an den Übergang „Abmelden"'], erwartet: 'muss entry sein' },
      { id: '3', label: 'Übergang „after(30 min) / fehler = 0"', optionen: ['korrekt', 'muss when(30 min) heißen', 'braucht die Bedingung [30 min]', 'muss zum Endzustand führen'], erwartet: 'korrekt' },
      { id: '4', label: 'Übergang „Abmelden" zum Endzustand', optionen: ['korrekt', 'muss zurück zu „Abgemeldet" führen', 'braucht die Bedingung [fehler = 0]', 'muss after(…) heißen'], erwartet: 'muss zurück zu „Abgemeldet" führen' },
    ],
    loesung: [
      '[1] Der dritte Fehlversuch kommt bei fehler = 2 an. [fehler < 2] und [fehler > 2] lassen genau diesen Fall offen – das Konto würde nie gesperrt. Richtig ist [fehler >= 2].',
      '[2] Die Startseite erscheint **beim Betreten** von Angemeldet → entry. exit liefe erst beim Abmelden.',
      '[3] Richtig: Nach Ablauf der Zeit schaltet das Zeitereignis after(30 min); die Aktion setzt den Zähler zurück, wie gefordert.',
      '[4] Abmelden beendet nicht den Lebenszyklus des Kontos, sondern führt laut Text zurück in einen früheren Zustand – ein Rücksprung nach Abgemeldet.',
    ],
    muster: {
      breite: 720,
      hoehe: 350,
      knoten: [
        start('s', 50, 120),
        zu('ab', 220, 120, 'Abgemeldet', null, { w: 140 }),
        zu('an', 600, 120, 'Angemeldet', ['entry / Startseite anzeigen'], { hervor: true }),
        zu('gesperrt', 220, 300, 'Gesperrt', ['entry / Sperrhinweis anzeigen']),
      ],
      kanten: [
        f('s', 'ab'),
        f('ab', 'ab', 'Passwort falsch [fehler < 2] / fehler erhöhen', { vonSeite: 'oben:-40', via: [[180, 50], [260, 50]], nachSeite: 'oben:40' }),
        f('ab', 'an', 'Passwort korrekt / fehler = 0', { vonSeite: 'rechts:-12', nachSeite: 'links:-12' }),
        f('an', 'ab', 'Abmelden', { vonSeite: 'links:12', nachSeite: 'rechts:12', textSeite: -1, hervor: true }),
        f('ab', 'gesperrt', 'Passwort falsch\n[fehler >= 2]\n/ Admin informieren', { vonSeite: 'unten:-30', nachSeite: 'oben:-30', textSeite: -1, textPos: 0.4, hervor: true }),
        f('gesperrt', 'ab', 'after(30 min)\n/ fehler = 0', { vonSeite: 'oben:30', nachSeite: 'unten:30', textPos: 0.4 }),
      ],
    },
  },
  {
    id: 'zu-f2',
    art: 'fehler',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'E-Scooter im Verleih',
    text: 'Ein E-Scooter ist **Verfügbar**. Reserviert ein Kunde ihn, ist er **Reserviert**. Wird er nicht innerhalb von 15 Minuten entsperrt, ist er wieder verfügbar. Nach dem Entsperren ist er **In Fahrt**; während der ganzen Fahrt wird die Fahrzeit gezählt. Beim Beenden der Fahrt wird abgerechnet. Liegt der Akkustand **unter 15 %**, wird der Scooter **Gesperrt** und der Service benachrichtigt, sonst ist er wieder verfügbar. Ist der Akku geladen, ist er wieder verfügbar. Prüfe die Stellen 1–4.',
    diagramm: {
      breite: 830,
      hoehe: 450,
      knoten: [
        start('s', 50, 80),
        zu('frei', 190, 80, 'Verfügbar', null, { w: 140 }),
        zu('res', 560, 80, 'Reserviert', null, { w: 140 }),
        zu('fahrt', 560, 250, 'In Fahrt', ['entry / Fahrzeit zählen'], { w: 180, marke: 3 }),
        zu('gesperrt', 560, 400, 'Gesperrt', ['entry / Service benachrichtigen']),
      ],
      kanten: [
        f('s', 'frei'),
        f('frei', 'res', 'reservieren', { vonSeite: 'rechts:-15', nachSeite: 'links:-15' }),
        f('res', 'frei', '[nach 15 min]', { vonSeite: 'links:15', nachSeite: 'rechts:15', textSeite: -1, marke: 1 }),
        f('res', 'fahrt', 'entsperren'),
        f('fahrt', 'frei', 'Fahrt beendet [akku >= 15 %] / abrechnen', { vonSeite: 'links', via: [[190, 250]], nachSeite: 'unten', textPos: 0.32 }),
        f('fahrt', 'gesperrt', 'Fahrt beendet [akku <= 15 %] / abrechnen', { marke: 2 }),
        f('gesperrt', 'frei', 'Akku geladen', { vonSeite: 'links', via: [[150, 400]], nachSeite: 'unten:-40', textPos: 0.25, marke: 4 }),
      ],
    },
    felder: [
      { id: '1', label: 'Übergang „[nach 15 min]"', optionen: ['korrekt', 'muss als Zeitereignis after(15 min) geschrieben werden', 'braucht zusätzlich die Aktion / abrechnen', 'muss nach „In Fahrt" führen'], erwartet: 'muss als Zeitereignis after(15 min) geschrieben werden' },
      { id: '2', label: 'Bedingung [akku <= 15 %]', optionen: ['korrekt', 'Lücke bei genau 15 %', 'Überschneidung bei genau 15 % – richtig: [akku < 15 %]', 'Bedingung gehört hinter die Aktion'], erwartet: 'Überschneidung bei genau 15 % – richtig: [akku < 15 %]' },
      { id: '3', label: '„entry / Fahrzeit zählen" in „In Fahrt"', optionen: ['korrekt', 'muss do sein', 'muss exit sein', 'gehört an den Übergang „entsperren"'], erwartet: 'muss do sein' },
      { id: '4', label: 'Übergang „Akku geladen" nach „Verfügbar"', optionen: ['korrekt', 'muss after(…) heißen', 'braucht die Bedingung [akku < 15 %]', 'muss zum Endzustand führen'], erwartet: 'korrekt' },
    ],
    loesung: [
      '[1] Eine Bedingung in eckigen Klammern ist kein Auslöser – sie wird nur geprüft, wenn etwas passiert. Für „nach Ablauf von 15 Minuten" brauchst du das Zeitereignis **after(15 min)**.',
      '[2] Bei genau 15 % wären [akku >= 15 %] **und** [akku <= 15 %] wahr – der Übergang wäre nicht eindeutig. „Unter 15 %" heißt [akku < 15 %].',
      '[3] Die Fahrzeit wird **während** der ganzen Fahrt gezählt → do. entry liefe nur einmal beim Betreten.',
      '[4] Richtig: Das Ereignis „Akku geladen" führt zurück in den früheren Zustand Verfügbar – ein Rücksprung.',
    ],
    muster: {
      breite: 830,
      hoehe: 450,
      knoten: [
        start('s', 50, 80),
        zu('frei', 190, 80, 'Verfügbar', null, { w: 140 }),
        zu('res', 560, 80, 'Reserviert', null, { w: 140 }),
        zu('fahrt', 560, 250, 'In Fahrt', ['do / Fahrzeit zählen'], { w: 180, hervor: true }),
        zu('gesperrt', 560, 400, 'Gesperrt', ['entry / Service benachrichtigen']),
      ],
      kanten: [
        f('s', 'frei'),
        f('frei', 'res', 'reservieren', { vonSeite: 'rechts:-15', nachSeite: 'links:-15' }),
        f('res', 'frei', 'after(15 min)', { vonSeite: 'links:15', nachSeite: 'rechts:15', textSeite: -1, hervor: true }),
        f('res', 'fahrt', 'entsperren'),
        f('fahrt', 'frei', 'Fahrt beendet [akku >= 15 %] / abrechnen', { vonSeite: 'links', via: [[190, 250]], nachSeite: 'unten', textPos: 0.32 }),
        f('fahrt', 'gesperrt', 'Fahrt beendet [akku < 15 %] / abrechnen', { hervor: true }),
        f('gesperrt', 'frei', 'Akku geladen', { vonSeite: 'links', via: [[150, 400]], nachSeite: 'unten:-40', textPos: 0.25 }),
      ],
    },
  },
  {
    id: 'zu-q1',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Beschriftungen verstehen',
    text: 'Beantworte die Fragen zur Schreibweise im Zustandsdiagramm.',
    felder: [
      {
        id: 'a',
        label: 'Übergang „Karte eingesteckt [PIN korrekt] / Konto anzeigen": Was ist der Auslöser?',
        optionen: ['PIN korrekt', 'Karte eingesteckt', 'Konto anzeigen', 'der Zielzustand'],
        erwartet: 'Karte eingesteckt',
      },
      {
        id: 'b',
        label: 'Wann wird dabei „Konto anzeigen" ausgeführt?',
        optionen: ['immer, wenn eine Karte eingesteckt wird', 'solange der Zielzustand besteht', 'beim Übergang, wenn die Karte eingesteckt wird und die PIN korrekt ist', 'beim Verlassen des Zielzustands'],
        erwartet: 'beim Übergang, wenn die Karte eingesteckt wird und die PIN korrekt ist',
      },
      {
        id: 'c',
        label: 'Im Zustand „Heizen" steht „do / Temperatur regeln". Was bedeutet das?',
        optionen: ['Die Temperatur wird einmal beim Betreten geregelt.', 'Die Temperatur wird geregelt, solange „Heizen" besteht.', 'Die Temperatur wird beim Verlassen geregelt.', 'Die Temperatur wird nach einer festen Zeit geregelt.'],
        erwartet: 'Die Temperatur wird geregelt, solange „Heizen" besteht.',
      },
      {
        id: 'd',
        label: 'Ein Rabatt gilt ab 50 €. Welches Bedingungspaar ist richtig?',
        optionen: ['[betrag < 50] und [betrag > 50]', '[betrag <= 50] und [betrag >= 50]', '[betrag < 50] und [betrag >= 50]', '[betrag < 49] und [betrag > 50]'],
        erwartet: '[betrag < 50] und [betrag >= 50]',
      },
      {
        id: 'e',
        label: '„Nach 30 Sekunden ohne Eingabe zurück zum Startbildschirm" – wie lautet der Auslöser?',
        optionen: ['after(30 s)', '[30 s]', 'do / 30 s warten', 'exit / 30 s'],
        erwartet: 'after(30 s)',
      },
      {
        id: 'f',
        label: 'Was bedeutet der Endzustand?',
        optionen: ['Das Objekt wartet auf das nächste Ereignis.', 'Der Lebenszyklus des Objekts ist beendet; es folgen keine Übergänge mehr.', 'Das Objekt springt zurück zum Startzustand.', 'Der letzte Zustand wird wiederholt.'],
        erwartet: 'Der Lebenszyklus des Objekts ist beendet; es folgen keine Übergänge mehr.',
      },
    ],
    loesung: [
      '(a) Reihenfolge der Beschriftung: **Auslöser [Bedingung] / Aktion**. Vorne steht das Ereignis, in Klammern die Bedingung, hinter dem Schrägstrich die Aktion.',
      '(b) Der Übergang schaltet nur, wenn der Auslöser eintritt **und** die Bedingung wahr ist. Die Aktion läuft genau dann – beim Wechsel.',
      '(c) entry = einmal beim Betreten, do = solange der Zustand besteht, exit = einmal beim Verlassen.',
      '(d) „Ab 50 €" schließt 50 ein: [betrag >= 50]. Das Gegenstück ist [betrag < 50] – lückenlos und ohne Überschneidung.',
      '(e) Eine verstrichene Zeit im Zustand ist ein Zeitereignis: after(30 s).',
      '(f) Der Endzustand (Kreis mit Punkt) hat keine ausgehenden Übergänge – das Objekt ist „fertig".',
    ],
  },
  {
    id: 'zu-q2',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Fußgängerampel lesen',
    text: 'Das Diagramm zeigt die Autoampel an einem Fußgängerüberweg. Beantworte die Fragen.',
    diagramm: {
      breite: 640,
      hoehe: 300,
      knoten: [
        start('s', 40, 70),
        zu('gruen', 170, 70, 'Grün'),
        zu('gelb', 500, 70, 'Gelb'),
        zu('rot', 500, 230, 'Rot', ['entry / Fußgängersignal grün', 'exit / Fußgängersignal rot']),
        zu('rotgelb', 170, 230, 'Rot-Gelb'),
      ],
      kanten: [
        f('s', 'gruen'),
        f('gruen', 'gelb', 'Taste gedrückt'),
        f('gelb', 'rot', 'after(3 s)'),
        f('rot', 'rotgelb', 'after(15 s)'),
        f('rotgelb', 'gruen', 'after(2 s)'),
      ],
    },
    felder: [
      { id: 'a', label: 'Die Ampel ist Grün, niemand drückt die Taste. Was passiert?', optionen: ['Nach 3 s wird sie Gelb.', 'Sie bleibt Grün.', 'Sie wird sofort Rot.', 'Sie wechselt zu Rot-Gelb.'], erwartet: 'Sie bleibt Grün.' },
      { id: 'b', label: 'Wann wird das Fußgängersignal grün?', optionen: ['beim Tastendruck', 'beim Betreten von „Rot"', 'beim Verlassen von „Rot"', 'nach 15 s in „Rot"'], erwartet: 'beim Betreten von „Rot"' },
      { id: 'c', label: 'Wie lange bleibt die Autoampel Rot?', optionen: ['2 s', '3 s', '15 s', '20 s'], erwartet: '15 s' },
      {
        id: 'd',
        label: 'Die Taste wird gedrückt, während die Ampel Gelb ist. Was passiert?',
        optionen: ['Die Ampel wird sofort Rot.', 'Die Ampel wird wieder Grün.', 'Die Gelbphase beginnt von vorn.', 'Nichts – in „Gelb" gibt es keinen Übergang mit diesem Auslöser.'],
        erwartet: 'Nichts – in „Gelb" gibt es keinen Übergang mit diesem Auslöser.',
      },
    ],
    loesung: [
      '(a) Aus Grün führt nur der Übergang „Taste gedrückt". Ohne dieses Ereignis bleibt die Ampel im Zustand.',
      '(b) entry-Aktionen laufen beim Betreten des Zustands – das Fußgängersignal wird grün, sobald die Autoampel Rot ist.',
      '(c) after(15 s) schaltet, wenn die Ampel 15 Sekunden in Rot war. Dann folgt Rot-Gelb.',
      '(d) Ein Ereignis, für das der aktuelle Zustand keinen Übergang hat, bleibt wirkungslos.',
    ],
  },

  // ---------- Zeichnen ----------
  {
    id: 'zu-z1',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Online-Bestellung',
    text: 'Zeichne das Zustandsdiagramm einer Bestellung:\n- Nach dem Absenden ist die Bestellung **Offen**. Beim Betreten wird eine Bestellbestätigung gesendet.\n- Bezahlt der Kunde, ist sie **Bezahlt**. Ab einem Bestellwert von 50 € ist der Versand kostenlos; darunter werden beim Wechsel Versandkosten berechnet.\n- Wird eine offene Bestellung 7 Tage lang nicht bezahlt, ist sie **Storniert**; dabei erhält der Kunde eine Storno-Mail. Nach 30 Tagen wird eine stornierte Bestellung gelöscht (Ende).\n- Übergibt das Lager das Paket an den Versanddienst, ist sie **Versendet**. Solange sie versendet ist, wird die Sendungsverfolgung aktualisiert.\n- Kommt das Paket als unzustellbar zurück, ist die Bestellung wieder **Bezahlt**. Wird es zugestellt, endet der Lebenszyklus.',
    muster: {
      breite: 900,
      hoehe: 420,
      knoten: [
        start('s', 40, 80),
        zu('offen', 190, 80, 'Offen', ['entry / Bestätigung senden'], { w: 190 }),
        zu('bezahlt', 720, 80, 'Bezahlt', null, { w: 140 }),
        zu('versendet', 720, 260, 'Versendet', ['do / Sendungsverfolgung aktualisieren']),
        zu('storniert', 190, 260, 'Storniert', null, { w: 140 }),
        ende('e1', 720, 385),
        ende('e2', 190, 385),
      ],
      kanten: [
        f('s', 'offen'),
        f('offen', 'bezahlt', 'bezahlt [bestellwert >= 50 €]', { vonSeite: 'rechts:-14', nachSeite: 'links:-14' }),
        f('offen', 'bezahlt', 'bezahlt [bestellwert < 50 €] / Versandkosten berechnen', { vonSeite: 'rechts:14', nachSeite: 'links:14', textSeite: -1 }),
        f('bezahlt', 'versendet', 'Paket übergeben', { vonSeite: 'unten:-30', nachSeite: 'oben:-30', textSeite: -1 }),
        f('versendet', 'bezahlt', 'Paket unzustellbar', { vonSeite: 'oben:30', nachSeite: 'unten:30' }),
        f('versendet', 'e1', 'Paket zugestellt'),
        f('offen', 'storniert', 'after(7 Tage) / Storno-Mail senden'),
        f('storniert', 'e2', 'after(30 Tage) / Bestellung löschen'),
      ],
    },
    pruefliste: [
      'Startzustand → **Offen** mit `entry / Bestätigung senden`',
      'Zwei Übergänge Offen → Bezahlt mit Auslöser **bezahlt** und lückenlosen Bedingungen **[bestellwert >= 50 €]** / **[bestellwert < 50 €]**',
      'Aktion **/ Versandkosten berechnen** nur am Übergang mit [bestellwert < 50 €]',
      '**after(7 Tage) / Storno-Mail senden** von Offen nach **Storniert**, von dort **after(30 Tage)** zum Endzustand',
      'Bezahlt → **Versendet** bei „Paket übergeben"; Versendet mit `do / Sendungsverfolgung aktualisieren`',
      'Rücksprung **Versendet → Bezahlt** bei „Paket unzustellbar"',
      'Endzustand nach „Paket zugestellt"',
      'Alle Übergänge in der Form Auslöser [Bedingung] / Aktion beschriftet',
    ],
    hinweise: 'Zwei Endzustände sind erlaubt; du kannst beide Übergänge auch in **einen** Endzustand führen. Die Grenze 50 € muss in genau **einer** Bedingung stecken – „ab 50 €" heißt >= 50.',
  },
  {
    id: 'zu-z2',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-1-5',
    titel: 'Parkticket',
    text: 'Zeichne das Zustandsdiagramm eines Parktickets:\n- Wird ein Ticket an der Einfahrt gezogen, wird **einmalig** die Einfahrtszeit gespeichert, und das Ticket ist **Unbezahlt**.\n- Wird es am Kassenautomaten eingesteckt, prüft der Automat die Parkdauer: **Bis einschließlich 30 Minuten** ist das Parken kostenlos, das Ticket ist sofort **Bezahlt**. Bei **mehr als 30 Minuten** wechselt es in **Zahlung offen**; beim Betreten wird die Gebühr angezeigt.\n- Zahlt der Kunde, ist das Ticket bezahlt. Zahlt er 2 Minuten lang nicht, wird das Ticket ausgegeben und ist wieder unbezahlt.\n- Ein bezahltes Ticket muss innerhalb von 15 Minuten an der Ausfahrt eingesteckt werden – dann öffnet sich die Schranke, und das Ticket wird eingezogen (Ende). Sonst ist es wieder unbezahlt.',
    muster: {
      breite: 880,
      hoehe: 340,
      knoten: [
        start('s', 220, 24),
        zu('unbezahlt', 220, 90, 'Unbezahlt', null, { w: 220 }),
        zu('bezahlt', 680, 90, 'Bezahlt', null, { w: 140 }),
        zu('offen', 220, 290, 'Zahlung offen', ['entry / Gebühr anzeigen'], { w: 220 }),
        ende('e', 720, 200),
      ],
      kanten: [
        f('s', 'unbezahlt', '/ Einfahrtszeit speichern'),
        f('unbezahlt', 'bezahlt', 'eingesteckt [parkdauer <= 30 min]', { vonSeite: 'rechts:-12', nachSeite: 'links:-12' }),
        f('bezahlt', 'unbezahlt', 'after(15 min)', { vonSeite: 'links:12', nachSeite: 'rechts:12', textSeite: -1 }),
        f('unbezahlt', 'offen', 'eingesteckt\n[parkdauer > 30 min]', { vonSeite: 'unten:-70', nachSeite: 'oben:-70', textSeite: -1 }),
        f('offen', 'unbezahlt', 'after(2 min)\n/ Ticket ausgeben', { vonSeite: 'oben:20', nachSeite: 'unten:20' }),
        f('offen', 'bezahlt', 'bezahlt', { vonSeite: 'rechts', via: [[640, 290]], nachSeite: 'unten:-40', textPos: 0.35 }),
        f('bezahlt', 'e', 'an Ausfahrt eingesteckt\n/ Schranke öffnen', { vonSeite: 'unten:40', nachSeite: 'oben' }),
      ],
    },
    pruefliste: [
      'Startzustand → **Unbezahlt**, die Aktion **/ Einfahrtszeit speichern** steht am Übergang vom Startzustand',
      'Auslöser **eingesteckt** mit **[parkdauer <= 30 min]** → Bezahlt und **[parkdauer > 30 min]** → Zahlung offen',
      '**Zahlung offen** mit `entry / Gebühr anzeigen`',
      'Zahlung offen → Bezahlt bei **bezahlt**',
      '**after(2 min) / Ticket ausgeben** zurück zu Unbezahlt',
      '**after(15 min)** von Bezahlt zurück zu Unbezahlt',
      'Bezahlt → **Endzustand** bei „an Ausfahrt eingesteckt / Schranke öffnen"',
    ],
    hinweise: 'Die Einfahrtszeit gehört **nicht** als entry in „Unbezahlt": Bei jedem Rücksprung (after(15 min), after(2 min)) würde sie sonst neu gesetzt. Die Gebühr kannst du auch als Aktion am Übergang zeigen („… / Gebühr anzeigen") statt als entry im Zustand. Wichtig ist, dass genau 30 Minuten in **einer** Bedingung steckt: <= 30 und > 30.',
  },
];

export default { spickzettel, notation, aufgaben };
