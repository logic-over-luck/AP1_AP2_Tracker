// Übungsdatenbank „Systemhaus Rheinblick": Kunden, Bestellungen, Artikel, Mitarbeiter.
// Bewusst mit Sonderfällen: Kunde ohne Ort, Kategorie ohne Artikel, Kunde ohne Bestellung,
// Mitarbeiter ohne Vorgesetzten, Artikel ohne Bestand und nie bestellte Artikel.

export const SCHEMA = [
  {
    name: 'kategorie',
    spalten: [
      ['kategorie_id', 'INTEGER', 'PK'],
      ['name', 'VARCHAR(40)'],
    ],
  },
  {
    name: 'artikel',
    spalten: [
      ['artikel_id', 'INTEGER', 'PK'],
      ['bezeichnung', 'VARCHAR(60)'],
      ['kategorie_id', 'INTEGER', 'FK → kategorie'],
      ['preis', 'DECIMAL(8,2)'],
      ['bestand', 'INTEGER'],
    ],
  },
  {
    name: 'kunde',
    spalten: [
      ['kunden_id', 'INTEGER', 'PK'],
      ['firma', 'VARCHAR(60)'],
      ['ort', 'VARCHAR(40)'],
      ['plz', 'CHAR(5)'],
      ['kunde_seit', 'DATE'],
    ],
  },
  {
    name: 'mitarbeiter',
    spalten: [
      ['ma_id', 'INTEGER', 'PK'],
      ['vorname', 'VARCHAR(30)'],
      ['nachname', 'VARCHAR(30)'],
      ['abteilung', 'VARCHAR(30)'],
      ['gehalt', 'DECIMAL(8,2)'],
      ['eintritt', 'DATE'],
      ['vorgesetzter_id', 'INTEGER', 'FK → mitarbeiter'],
    ],
  },
  {
    name: 'bestellung',
    spalten: [
      ['bestell_id', 'INTEGER', 'PK'],
      ['kunden_id', 'INTEGER', 'FK → kunde'],
      ['ma_id', 'INTEGER', 'FK → mitarbeiter'],
      ['datum', 'DATE'],
    ],
  },
  {
    name: 'bestellposition',
    spalten: [
      ['bestell_id', 'INTEGER', 'PK, FK → bestellung'],
      ['artikel_id', 'INTEGER', 'PK, FK → artikel'],
      ['menge', 'INTEGER'],
    ],
  },
  {
    name: 'lieferant',
    spalten: [
      ['lieferant_id', 'INTEGER', 'PK'],
      ['firma', 'VARCHAR(60)'],
      ['ort', 'VARCHAR(40)'],
    ],
  },
];

export const ERSTELLEN = `
PRAGMA foreign_keys = ON;
CREATE TABLE kategorie (
  kategorie_id INTEGER PRIMARY KEY,
  name VARCHAR(40) NOT NULL
);
CREATE TABLE artikel (
  artikel_id INTEGER PRIMARY KEY,
  bezeichnung VARCHAR(60) NOT NULL,
  kategorie_id INTEGER REFERENCES kategorie(kategorie_id),
  preis DECIMAL(8,2) NOT NULL,
  bestand INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE kunde (
  kunden_id INTEGER PRIMARY KEY,
  firma VARCHAR(60) NOT NULL,
  ort VARCHAR(40),
  plz CHAR(5),
  kunde_seit DATE
);
CREATE TABLE mitarbeiter (
  ma_id INTEGER PRIMARY KEY,
  vorname VARCHAR(30),
  nachname VARCHAR(30),
  abteilung VARCHAR(30),
  gehalt DECIMAL(8,2),
  eintritt DATE,
  vorgesetzter_id INTEGER REFERENCES mitarbeiter(ma_id)
);
CREATE TABLE bestellung (
  bestell_id INTEGER PRIMARY KEY,
  kunden_id INTEGER NOT NULL REFERENCES kunde(kunden_id),
  ma_id INTEGER REFERENCES mitarbeiter(ma_id),
  datum DATE NOT NULL
);
CREATE TABLE bestellposition (
  bestell_id INTEGER REFERENCES bestellung(bestell_id),
  artikel_id INTEGER REFERENCES artikel(artikel_id),
  menge INTEGER NOT NULL,
  PRIMARY KEY (bestell_id, artikel_id)
);
CREATE TABLE lieferant (
  lieferant_id INTEGER PRIMARY KEY,
  firma VARCHAR(60) NOT NULL,
  ort VARCHAR(40)
);

INSERT INTO kategorie VALUES
 (1, 'Notebooks'), (2, 'Monitore'), (3, 'Zubehör'), (4, 'Netzwerk'), (5, 'Software'), (6, 'Server');

INSERT INTO artikel VALUES
 (101, 'Notebook ProBook 14', 1, 899.00, 12),
 (102, 'Notebook UltraLight 13', 1, 1249.00, 4),
 (103, 'Notebook Workstation 16', 1, 2199.00, 2),
 (201, 'Monitor 24 Zoll', 2, 159.00, 25),
 (202, 'Monitor 27 Zoll 4K', 2, 389.00, 9),
 (203, 'Monitor 34 Zoll curved', 2, 549.00, 0),
 (301, 'Maus kabellos', 3, 24.90, 80),
 (302, 'Tastatur DE', 3, 39.90, 45),
 (303, 'Headset USB', 3, 69.00, 30),
 (304, 'Dockingstation USB-C', 3, 189.00, 14),
 (305, 'Webcam HD', 3, 79.00, 0),
 (401, 'Switch 24 Port', 4, 329.00, 6),
 (402, 'Access Point WiFi 6', 4, 179.00, 11),
 (403, 'Patchkabel 2 m', 4, 4.50, 300),
 (501, 'Office-Paket (1 Jahr)', 5, 99.00, 50),
 (502, 'Virenschutz (1 Jahr)', 5, 29.90, 120);

INSERT INTO kunde VALUES
 (1, 'Gutenberg Druck GmbH', 'Mainz', '55116', '2019-03-12'),
 (2, 'Weinhaus Rheinhessen', 'Alzey', '55232', '2021-07-01'),
 (3, 'Kanzlei Berger & Partner', 'Wiesbaden', '65183', '2018-11-20'),
 (4, 'Praxis Dr. Yilmaz', 'Mainz', '55122', '2022-02-15'),
 (5, 'Bäckerei Hoffmann', 'Bingen', '55411', '2023-09-05'),
 (6, 'Logistik Nord KG', 'Frankfurt', '60311', '2020-05-30'),
 (7, 'Stadtbibliothek', 'Mainz', '55116', '2024-01-10'),
 (8, 'Fahrradladen Speiche', 'Wiesbaden', '65185', '2025-04-22'),
 (9, 'Start-up Klarfeld', NULL, NULL, '2025-11-03'),
 (10, 'Hotel Am Dom', 'Mainz', '55116', '2017-06-19');

INSERT INTO mitarbeiter VALUES
 (1, 'Sabine', 'Krüger', 'Geschäftsleitung', 7800.00, '2012-04-01', NULL),
 (2, 'Jonas', 'Müller', 'Vertrieb', 4200.00, '2016-09-01', 1),
 (3, 'Aylin', 'Demir', 'Vertrieb', 3900.00, '2019-03-15', 2),
 (4, 'Markus', 'Meier', 'Technik', 4600.00, '2015-01-01', 1),
 (5, 'Lea', 'Schmitt', 'Technik', 3700.00, '2021-08-01', 4),
 (6, 'Tim', 'Maurer', 'Technik', 3300.00, '2023-03-01', 4),
 (7, 'Nina', 'Wagner', 'Verwaltung', 3500.00, '2018-06-01', 1),
 (8, 'Paul', 'Becker', 'Vertrieb', 3600.00, '2024-10-01', 2);

INSERT INTO bestellung VALUES
 (1001, 1, 2, '2024-02-14'),
 (1002, 3, 3, '2024-05-03'),
 (1003, 1, 2, '2024-09-20'),
 (1004, 6, 8, '2024-12-02'),
 (1005, 2, 3, '2025-01-17'),
 (1006, 4, 2, '2025-03-08'),
 (1007, 1, 3, '2025-03-21'),
 (1008, 10, 8, '2025-06-30'),
 (1009, 3, 2, '2025-08-12'),
 (1010, 6, 3, '2025-10-01'),
 (1011, 8, 8, '2025-11-15'),
 (1012, 1, 2, '2026-01-09'),
 (1013, 10, 3, '2026-02-20'),
 (1014, 4, 8, '2026-04-02');

INSERT INTO bestellposition VALUES
 (1001, 101, 3), (1001, 301, 3), (1001, 501, 3),
 (1002, 102, 1), (1002, 202, 2),
 (1003, 201, 5), (1003, 302, 5), (1003, 403, 20),
 (1004, 401, 2), (1004, 402, 4), (1004, 403, 50),
 (1005, 101, 1), (1005, 502, 2),
 (1006, 103, 1), (1006, 202, 1), (1006, 303, 2),
 (1007, 304, 6), (1007, 201, 6),
 (1008, 402, 6), (1008, 401, 1),
 (1009, 101, 2), (1009, 301, 2),
 (1010, 403, 100), (1010, 501, 10),
 (1011, 101, 1),
 (1012, 102, 2), (1012, 303, 4), (1012, 502, 10),
 (1013, 402, 3),
 (1014, 201, 2), (1014, 302, 2);

INSERT INTO lieferant VALUES
 (1, 'TechDistri AG', 'Frankfurt'),
 (2, 'Kabelwerk Süd', 'Mannheim'),
 (3, 'Displayhaus', 'Mainz'),
 (4, 'SoftLizenz GmbH', 'Köln');
`;

// Funktionen aus dem Belegsatz, die SQLite nicht kennt. Der Belegsatz der Prüfung nennt u. a.
// YEAR, MONTH, NOW, DATEDIFF, DATEADD, LEFT, RIGHT. Weil die Argument-Reihenfolge je nach System
// verschieden ist, akzeptieren DATEDIFF und DATEADD beide üblichen Formen.
function tage(datum) {
  return Math.floor(Date.parse(`${String(datum).slice(0, 10)}T00:00:00Z`) / 86400000);
}
function isoTag(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}
const EINHEIT = { day: 'd', days: 'd', dd: 'd', d: 'd', tag: 'd', month: 'm', mm: 'm', m: 'm', monat: 'm', year: 'y', yy: 'y', yyyy: 'y', jahr: 'y' };

function datumPlus(datum, n, einheit) {
  const d = new Date(`${String(datum).slice(0, 10)}T00:00:00Z`);
  if (einheit === 'y') d.setUTCFullYear(d.getUTCFullYear() + n);
  else if (einheit === 'm') d.setUTCMonth(d.getUTCMonth() + n);
  else d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function registriereFunktionen(db, heute = new Date()) {
  const jetzt = isoTag(heute.getTime() - heute.getTimezoneOffset() * 60000);
  // sql.js registriert je Aufruf die Stelligkeit (Function.length), ruft aber je Name die zuletzt
  // registrierte Funktion auf; fehlende Argumente kommen dort als undefined an.
  const mehrfach = (name, f, von, bis) => {
    const g = (...a) => f(...a.filter((x) => x !== undefined));
    const stellig = [
      () => g(),
      (a) => g(a),
      (a, b) => g(a, b),
      (a, b, c) => g(a, b, c),
      (a, b, c, d) => g(a, b, c, d),
      (a, b, c, d, e) => g(a, b, c, d, e),
      (a, b, c, d, e, h) => g(a, b, c, d, e, h),
    ];
    for (let n = von; n <= bis; n++) db.create_function(name, stellig[n]);
  };
  const tl = (d) => (d === null || d === undefined ? null : String(d));
  db.create_function('YEAR', (d) => (tl(d) ? Number(tl(d).slice(0, 4)) : null));
  db.create_function('MONTH', (d) => (tl(d) ? Number(tl(d).slice(5, 7)) : null));
  db.create_function('DAY', (d) => (tl(d) ? Number(tl(d).slice(8, 10)) : null));
  db.create_function('NOW', () => jetzt);
  db.create_function('CURDATE', () => jetzt);
  db.create_function('CURRENT_DATE_DE', () => jetzt);
  db.create_function('LEFT', (s, n) => (s === null ? null : String(s).slice(0, n)));
  db.create_function('RIGHT', (s, n) => (s === null ? null : n <= 0 ? '' : String(s).slice(-n)));
  mehrfach('CONCAT', (...a) => (a.some((x) => x === null) ? null : a.map(String).join('')), 1, 6);
  // DATEDIFF(ende, start) wie MySQL → Tage; DATEDIFF(einheit, start, ende) wie SQL Server
  mehrfach(
    'DATEDIFF',
    (a, b, c) => {
      if (c === undefined) return a === null || b === null ? null : tage(a) - tage(b);
      const e = EINHEIT[String(a).toLowerCase()] ?? 'd';
      if (b === null || c === null) return null;
      if (e === 'd') return tage(c) - tage(b);
      const [y1, m1] = [Number(String(b).slice(0, 4)), Number(String(b).slice(5, 7))];
      const [y2, m2] = [Number(String(c).slice(0, 4)), Number(String(c).slice(5, 7))];
      return e === 'y' ? y2 - y1 : (y2 - y1) * 12 + (m2 - m1);
    },
    2,
    3,
  );
  // DATEADD(einheit, anzahl, datum) wie SQL Server; DATE_ADD(datum, tage) vereinfacht
  db.create_function('DATEADD', (e, n, d) => (d === null ? null : datumPlus(d, Number(n), EINHEIT[String(e).toLowerCase()] ?? 'd')));
  db.create_function('DATE_ADD', (d, n) => (d === null ? null : datumPlus(d, Number(n), 'd')));
  // Weitere Funktionen aus dem Belegsatz
  db.create_function('WEEKDAY', (d) => (tl(d) ? (new Date(`${tl(d).slice(0, 10)}T00:00:00Z`).getUTCDay() + 6) % 7 : null));
  db.create_function('HOUR', (d) => (tl(d) && tl(d).length >= 13 ? Number(tl(d).slice(11, 13)) : tl(d) ? 0 : null));
  db.create_function('MINUTE', (d) => (tl(d) && tl(d).length >= 16 ? Number(tl(d).slice(14, 16)) : tl(d) ? 0 : null));
  const streuung = (wurzel) => ({
    init: () => [],
    step: (werte, x) => (x === null || x === undefined ? werte : [...werte, Number(x)]),
    finalize: (werte) => {
      if (!werte.length) return null;
      const m = werte.reduce((a, b) => a + b, 0) / werte.length;
      const v = werte.reduce((a, b) => a + (b - m) ** 2, 0) / werte.length;
      return wurzel ? Math.sqrt(v) : v;
    },
  });
  if (db.create_aggregate) {
    db.create_aggregate('STDDEV', streuung(true));
    db.create_aggregate('VARIANCE', streuung(false));
  }
}
