// Verzeichnis der Trainer: wer welche Stichpunkte übt.
//
// Jeder Trainer hat Modi; jeder Modus nennt die Stichpunkte, die er übt. Daraus folgt:
// – In einem Lernraum erscheinen nur Trainer (und Modi), die dort Stichpunkte haben.
// – Der Knopf „Üben" an Block und Stichpunkt führt direkt in den passenden Modus.
// Ein neuer Trainer braucht nur einen Eintrag hier und eine Komponente in trainer/index.jsx.
// Rein und ohne Browser-Abhängigkeit (wird in den Tests geprüft).

export const TRAINER = [
  {
    id: 'zahlen',
    name: 'Zahlen & IT-Rechnen',
    kurz: 'Zahlen',
    icon: 'binary',
    text: 'Zahlensysteme, Präfixe, Datenmengen, Übertragung, Energie',
    modi: [
      { id: 'zahlensysteme', name: 'Zahlensysteme', sp: ['AP1-4-2-1'] },
      { id: 'praefixe', name: 'Präfixe: kB und KiB', sp: ['AP1-4-2-1'] },
      { id: 'datenmenge', name: 'Speicherbedarf', sp: ['AP1-4-2-2', 'AP2-6-6-3'] },
      { id: 'uebertragung', name: 'Übertragungszeit', sp: ['AP1-4-2-2', 'AP2-6-6-3'] },
      { id: 'energie', name: 'Leistung & Stromkosten', sp: ['AP1-4-2-3'] },
      { id: 'rechte', name: 'Dateirechte (chmod)', sp: ['AP1-5-2-3'] },
      { id: 'paritaet', name: 'Paritätsbit', sp: ['AP2-5-5-3'] },
    ],
  },
  {
    id: 'subnetz',
    name: 'Subnetze',
    kurz: 'Subnetze',
    icon: 'network',
    text: 'Netzadresse, Broadcast, Hostbereich, Maske, IPv6',
    modi: [
      // bereich: Der Subnetz-Trainer hat zwei Räume – Verstehen (Lektionen) und Üben (Aufgaben + Visualizer)
      { id: 'verstehen', name: 'Lektionen', bereich: 'verstehen', sp: ['AP1-6-2-2', 'AP1-6-2-1'] },
      { id: 'analyse', name: 'Netz bestimmen', bereich: 'ueben', sp: ['AP1-6-2-2'] },
      { id: 'maske', name: 'Präfix und Maske', bereich: 'ueben', sp: ['AP1-6-2-2', 'AP1-6-2-1'] },
      { id: 'gleich', name: 'Gleiches Netz?', bereich: 'ueben', sp: ['AP1-6-2-2'] },
      { id: 'privat', name: 'Private Adressen', bereich: 'ueben', sp: ['AP1-6-2-1'] },
      { id: 'ipv6', name: 'IPv6 kürzen & ausschreiben', bereich: 'ueben', sp: ['AP1-6-2-3'] },
      {
        id: 'aufteilen',
        name: 'Netz aufteilen (Zusatz)',
        bereich: 'ueben',
        sp: [],
        zusatzIn: ['AP1'],
        hinweis: 'Für AP1 laut Rahmen nicht belegt – zum Vertiefen.',
      },
      { id: 'visual', name: 'Visualizer (Nachschlagen)', bereich: 'ueben', sp: ['AP1-6-2-2', 'AP1-6-2-1'] },
    ],
  },
  {
    id: 'kaufmaennisch',
    name: 'Kaufmännisches Rechnen',
    kurz: 'Kaufmännisch',
    icon: 'receipt-euro',
    text: 'Rechnung, Kostenvergleich, Nutzwertanalyse, Kennzahlen',
    modi: [
      { id: 'rechnung', name: 'Rechnung: Rabatt, USt, Skonto', sp: ['AP1-3-1-4', 'AP1-3-1-2'] },
      { id: 'nutzungsdauer', name: 'Kosten über die Nutzungsdauer', sp: ['AP1-3-1-2'] },
      { id: 'kalkulation', name: 'Budget, Vor- und Nachkalkulation', sp: ['AP1-3-1-3'] },
      { id: 'kostenvergleich', name: 'Kostenvergleich', sp: ['AP1-3-2-1'] },
      { id: 'tilgung', name: 'Tilgungsplan', sp: ['AP1-3-2-1'] },
      { id: 'angebot', name: 'Angebotsvergleich', sp: ['AP1-3-2-2'] },
      { id: 'nutzwert', name: 'Nutzwertanalyse', sp: ['AP1-3-2-3'] },
      { id: 'sollist', name: 'Soll-Ist-Vergleich', sp: ['AP2-5-5-2', 'AP1-3-1-3'] },
      { id: 'sv', name: 'Sozialversicherung', sp: ['WISO-1-6-3'] },
      { id: 'gewinn', name: 'Gewinnverteilung GmbH', sp: ['WISO-2-2-3'] },
      { id: 'kennzahlen', name: 'Produktivität, Wirtschaftlichkeit, Rentabilität', sp: ['WISO-2-4-1'] },
    ],
  },
  {
    id: 'netzplan',
    name: 'Netzplan & Projektplanung',
    kurz: 'Netzplan',
    icon: 'workflow',
    text: 'Vorwärts- und Rückwärtsrechnung, Puffer, kritischer Weg, Gantt',
    modi: [
      { id: 'berechnen', name: 'Netzplan berechnen', sp: ['AP1-1-2-2', 'AP2-1-1-4'] },
      { id: 'aufbauen', name: 'Aus Vorgangsliste aufbauen', sp: ['AP1-1-2-2', 'AP2-1-1-4'] },
      { id: 'gantt', name: 'Gantt-Diagramm', sp: ['AP1-1-2-1'] },
      { id: 'psp', name: 'Projektstrukturplan', sp: ['AP1-1-2-1'] },
    ],
  },
  {
    id: 'code',
    name: 'Pseudocode',
    kurz: 'Pseudocode',
    icon: 'code-xml',
    text: 'Grundlagen, Visualizer, Schreibtischtest, Puzzle, Fehlersuche',
    modi: [
      { id: 'grundlagen', name: 'Grundlagen', sp: ['AP1-8-2-1', 'AP1-8-2-2', 'AP2-3-2-1'] },
      { id: 'visualizer', name: 'Visualizer', sp: ['AP1-8-2-3', 'AP2-3-2-1', 'AP2-3-2-2'] },
      { id: 'schreibtisch', name: 'Schreibtischtest', sp: ['AP1-8-2-3', 'AP2-5-2-3'] },
      { id: 'puzzle', name: 'Code-Puzzle', sp: ['AP1-8-2-2', 'AP2-3-2-1', 'AP2-3-2-2', 'AP2-3-3-1', 'AP2-3-4-1'] },
      { id: 'fehler', name: 'Fehlersuche', sp: ['AP1-8-2-4', 'AP1-8-2-2', 'AP2-5-2-3'] },
      { id: 'sortieren', name: 'Suchen & Sortieren', sp: ['AP2-3-2-3'] },
    ],
  },
  {
    id: 'sql',
    name: 'SQL-Labor',
    kurz: 'SQL-Labor',
    icon: 'database',
    text: 'Echte Abfragen gegen eine Übungsdatenbank',
    modi: [
      { id: 'abfragen', name: 'Abfragen', sp: ['AP2-4-2-1', 'AP2-4-2-2', 'AP2-4-2-3', 'AP2-4-2-4'] },
      { id: 'aendern', name: 'Daten ändern', sp: ['AP2-4-3-1'] },
      { id: 'struktur', name: 'Tabellen & Index', sp: ['AP2-4-3-2'] },
      { id: 'rechte', name: 'Benutzer & Rechte', sp: ['AP2-4-3-3'] },
      { id: 'frei', name: 'Freies Labor', sp: ['AP2-4-2-1'] },
    ],
  },
  {
    id: 'modellieren',
    name: 'Modellieren',
    kurz: 'Modellieren',
    icon: 'shapes',
    text: 'UML, ER-Modell, Normalisierung, Prozesse, Masken',
    modi: [
      { id: 'anwendungsfall', name: 'Anwendungsfalldiagramm', sp: ['AP1-8-3-1', 'AP2-2-1-2'] },
      { id: 'klasse', name: 'Klassendiagramm', sp: ['AP1-8-3-2', 'AP2-2-1-1'] },
      { id: 'aktivitaet', name: 'Aktivitätsdiagramm', sp: ['AP1-8-3-3', 'AP2-2-1-3'] },
      { id: 'sequenz', name: 'Sequenzdiagramm', sp: ['AP2-2-1-4'] },
      { id: 'zustand', name: 'Zustandsdiagramm', sp: ['AP2-2-1-5'] },
      { id: 'er', name: 'ER-Modell', sp: ['AP1-8-4-1', 'AP2-2-2-1'] },
      { id: 'relational', name: 'Relationales Modell', sp: ['AP2-2-2-2'] },
      { id: 'normalisierung', name: 'Normalisierung', sp: ['AP2-2-2-4', 'AP2-2-2-3'] },
      { id: 'prozess', name: 'EPK & BPMN', sp: ['AP2-2-3-1', 'AP1-8-4-4'] },
      { id: 'masken', name: 'Masken & Mockups', sp: ['AP1-8-4-3', 'AP2-1-5-2'] },
      { id: 'dokumente', name: 'Lasten- & Pflichtenheft', sp: ['AP2-1-1-2'] },
    ],
  },
];

const raumVon = (id) => (id.startsWith('WISO') ? 'WISO' : id.slice(0, 3));

export function trainerById(id) {
  return TRAINER.find((t) => t.id === id) ?? null;
}

// Modi eines Trainers, die im Lernraum gebraucht werden
export function modiIn(trainer, raum) {
  return trainer.modi.filter((m) => m.sp.some((id) => raumVon(id) === raum) || m.zusatzIn?.includes(raum));
}

export function trainerIn(raum) {
  return TRAINER.filter((t) => t.modi.some((m) => m.sp.some((id) => raumVon(id) === raum)));
}

// Für einen Stichpunkt: [{ trainer, modus }] – wo er geübt werden kann
export function uebungenFuer(spId) {
  const ergebnis = [];
  for (const t of TRAINER) for (const m of t.modi) if (m.sp.includes(spId)) ergebnis.push({ trainer: t, modus: m });
  return ergebnis;
}

export function uebungenFuerBlock(spIds) {
  const gesehen = new Map();
  for (const id of spIds) for (const u of uebungenFuer(id)) if (!gesehen.has(u.trainer.id + u.modus.id)) gesehen.set(u.trainer.id + u.modus.id, u);
  return [...gesehen.values()];
}
