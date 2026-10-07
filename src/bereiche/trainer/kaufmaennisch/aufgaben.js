// Aufgabenerzeuger „Kaufmännisches Rechnen". Rein, getestet in tests/kaufmaennisch.test.mjs.
//
// Geldbeträge werden wie auf echten Rechnungen je Schritt auf Cent gerundet. Weil man in der
// Prüfung auch mit ungerundeten Zwischenwerten rechnen darf, gilt für Eurobeträge eine
// Toleranz von einem Cent.

import { zahlText, runde, euro } from '../rahmen/pruefen.js';

const ct = (x) => runde(x, 2);
const z = zahlText;
const EUR = { stellen: 2, einheit: '€', toleranz: 0.011 };
const PROZ = { stellen: 2, einheit: '%', toleranz: 0.011 };

const ARTIKEL = [
  ['Notebook 15"', 649, 1199],
  ['Monitor 27"', 189, 429],
  ['Dockingstation', 119, 249],
  ['Tastatur-Maus-Set', 39, 89],
  ['Headset', 49, 129],
  ['SSD 1 TB', 59, 139],
  ['Netzwerkdrucker', 279, 699],
  ['Office-Lizenz (1 Jahr)', 99, 149],
  ['Webcam', 45, 119],
  ['USV 1500 VA', 219, 449],
];

// ---------- Rechnung ----------

export function rechnung(r) {
  const n = r.ganz(2, 3);
  const pos = r.mische(ARTIKEL).slice(0, n).map(([name, min, max]) => {
    const preis = r.stufe(min, max, 10) - (r.ja() ? 0.01 : 0);
    const menge = r.ganz(1, 12);
    return { name, preis: ct(preis), menge, summe: ct(preis * menge) };
  });
  const warenwert = ct(pos.reduce((a, p) => a + p.summe, 0));
  const rabattP = r.wahl([3, 5, 8, 10, 12, 15]);
  const rabatt = ct((warenwert * rabattP) / 100);
  const netto = ct(warenwert - rabatt);
  const ust = ct(netto * 0.19);
  const brutto = ct(netto + ust);
  const skontoP = r.wahl([2, 2, 3]);
  const skonto = ct((brutto * skontoP) / 100);
  const zahl = ct(brutto - skonto);
  const tabelle = {
    kopf: ['Position', 'Menge', 'Einzelpreis', 'Gesamt'],
    zeilen: pos.map((p) => [p.name, p.menge, euro(p.preis), euro(p.summe)]),
    rechtsbuendig: [1, 2, 3],
  };

  if (r.ja(0.3)) {
    // Rechnung prüfen: eine Zeile ist falsch
    const fehlerArt = r.wahl(['rabatt', 'ust', 'skonto', 'position']);
    const zeigen = { warenwert, rabatt, netto, ust, brutto, skonto, zahl };
    let falsch;
    if (fehlerArt === 'rabatt') {
      zeigen.rabatt = ct((warenwert * (rabattP - 2)) / 100);
      falsch = 'Rabatt';
    } else if (fehlerArt === 'ust') {
      zeigen.ust = ct(netto * 0.16);
      falsch = 'Umsatzsteuer';
    } else if (fehlerArt === 'skonto') {
      zeigen.skonto = ct((netto * skontoP) / 100);
      falsch = 'Skonto';
    } else {
      tabelle.zeilen[0][3] = euro(ct(pos[0].summe + pos[0].preis));
      falsch = `Gesamtpreis „${pos[0].name}"`;
    }
    const zeilen = [
      ['Warenwert', zeigen.warenwert],
      [`− ${rabattP} % Rabatt`, zeigen.rabatt],
      ['= Nettobetrag', zeigen.netto],
      ['+ 19 % Umsatzsteuer', zeigen.ust],
      ['= Rechnungsbetrag', zeigen.brutto],
      [`− ${skontoP} % Skonto bei Zahlung in 10 Tagen`, zeigen.skonto],
      ['= Zahlbetrag', zeigen.zahl],
    ];
    const optionen = [`Gesamtpreis „${pos[0].name}"`, 'Rabatt', 'Umsatzsteuer', 'Skonto'];
    return {
      titel: 'Rechnung prüfen',
      sp: 'AP1-3-1-4',
      text: `In der folgenden Rechnung steckt **genau ein Rechenfehler** (Folgezeilen sind mit dem falschen Wert weitergerechnet oder unverändert). Welche Angabe ist falsch?`,
      tabelle: { ...tabelle, zeilen: [...tabelle.zeilen, ...zeilen.map(([t, w]) => [t, '', '', euro(w)])] },
      felder: [{ id: 'x', label: 'Fehlerhafte Angabe', typ: 'auswahl', erwartet: falsch, optionen }],
      loesung: [
        `Positionen: ${pos.map((p) => `${p.menge} · ${euro(p.preis)} = ${euro(p.summe)}`).join(' · ')}`,
        `Warenwert ${euro(warenwert)} − ${rabattP} % = ${euro(netto)} (Rabatt ${euro(rabatt)})`,
        `USt 19 % von ${euro(netto)} = ${euro(ust)} → Rechnungsbetrag ${euro(brutto)}`,
        `Skonto ${skontoP} % vom Rechnungsbetrag = ${euro(skonto)} → Zahlbetrag ${euro(zahl)}`,
        `Falsch ist: **${falsch}**.`,
      ],
    };
  }

  return {
    titel: 'Rechnung berechnen',
    sp: 'AP1-3-1-4',
    text: `Berechne die Rechnung. Der Lieferant gewährt **${rabattP} % Rabatt**, die Umsatzsteuer beträgt **19 %**, bei Zahlung innerhalb von 10 Tagen dürfen **${skontoP} % Skonto** abgezogen werden. Runde jeden Betrag auf Cent.`,
    tabelle,
    felder: [
      { id: 'ww', label: 'Warenwert (Summe)', erwartet: warenwert, ...EUR },
      { id: 'rab', label: `Rabatt (${rabattP} %)`, erwartet: rabatt, ...EUR },
      { id: 'net', label: 'Nettobetrag', erwartet: netto, ...EUR },
      { id: 'ust', label: 'Umsatzsteuer (19 %)', erwartet: ust, ...EUR },
      { id: 'br', label: 'Rechnungsbetrag', erwartet: brutto, ...EUR },
      { id: 'zb', label: `Zahlbetrag mit ${skontoP} % Skonto`, erwartet: zahl, ...EUR },
    ],
    loesung: [
      `Warenwert: ${pos.map((p) => euro(p.summe)).join(' + ')} = **${euro(warenwert)}**`,
      `Rabatt: ${euro(warenwert)} · ${rabattP} % = **${euro(rabatt)}** → Nettobetrag **${euro(netto)}**`,
      `Umsatzsteuer: ${euro(netto)} · 19 % = **${euro(ust)}** → Rechnungsbetrag **${euro(brutto)}**`,
      `Skonto: ${euro(brutto)} · ${skontoP} % = ${euro(skonto)} → Zahlbetrag **${euro(zahl)}**`,
      'Reihenfolge: erst Rabatt abziehen, dann Umsatzsteuer aufschlagen; Skonto erst bei der Zahlung.',
    ],
  };
}

// ---------- Kosten über die Nutzungsdauer ----------

export function nutzungsdauer(r) {
  if (r.ja(0.3)) {
    // Schulung: Arbeitszeit, die ausfällt, als Kosten
    const teilnehmer = r.ganz(3, 12);
    const stunden = r.wahl([4, 6, 8, 16]);
    const satz = r.wahl([35, 42, 48, 55, 65]);
    const gebuehr = r.stufe(200, 1500, 50);
    const ausfall = teilnehmer * stunden * satz;
    return {
      titel: 'Schulungskosten',
      sp: 'AP1-3-1-2',
      text: `**${teilnehmer} Mitarbeiter** besuchen eine Schulung von **${stunden} Stunden**. Die Schulung kostet pauschal **${euro(gebuehr)}** netto. Während der Schulung fallen Arbeitsstunden aus, die mit **${satz} € je Stunde** bewertet werden. Wie hoch sind die Gesamtkosten der Schulung?`,
      felder: [
        { id: 'aus', label: 'Kosten der ausgefallenen Arbeitszeit', erwartet: ausfall, ...EUR },
        { id: 'ges', label: 'Gesamtkosten', erwartet: ausfall + gebuehr, ...EUR },
      ],
      loesung: [`Ausfall: ${teilnehmer} · ${stunden} h · ${satz} € = **${euro(ausfall)}**`, `Gesamt: ${euro(ausfall)} + ${euro(gebuehr)} = **${euro(ausfall + gebuehr)}**`, 'Entgangene Arbeitszeit zählt als Kosten, auch wenn kein Geld fließt.'],
    };
  }
  const geraet = r.wahl(['Server', 'Multifunktionsdrucker', 'Notebook-Pool', 'Firewall-Appliance', 'NAS-System']);
  const preis = r.stufe(1200, 9600, 120);
  const jahre = r.wahl([3, 4, 5]);
  const monate = jahre * 12;
  const wartung = r.stufe(15, 120, 5);
  const lizenz = r.wahl([0, 0, 9.9, 19.9, 29.9, 49]);
  const strom = r.stufe(5, 40, 1);
  const laufend = ct(wartung + lizenz + strom);
  const anteil = ct(preis / monate);
  const monat = ct(anteil + laufend);
  const gesamt = ct(preis + laufend * monate);
  return {
    titel: 'Kosten je Monat',
    sp: 'AP1-3-1-2',
    text: `Ein **${geraet}** kostet **${euro(preis)}** und wird über **${jahre} Jahre** genutzt. Jeden Monat fallen an: Wartung **${euro(wartung)}**${lizenz ? `, Lizenzen **${euro(lizenz)}**` : ''}, Strom **${euro(strom)}**. Der Kaufpreis wird gleichmäßig auf die Nutzungsdauer verteilt. Runde auf Cent.`,
    felder: [
      { id: 'anteil', label: 'Anteil Kaufpreis je Monat', erwartet: preis / monate, ...EUR },
      { id: 'monat', label: 'Gesamtkosten je Monat', erwartet: preis / monate + laufend, ...EUR },
      { id: 'gesamt', label: `Kosten über ${jahre} Jahre`, erwartet: gesamt, ...EUR, toleranz: 0.5 },
    ],
    loesung: [
      `Nutzungsdauer: ${jahre} · 12 = ${monates(monate)}`,
      `Kaufpreis je Monat: ${euro(preis)} ÷ ${monate} = **${euro(anteil)}**`,
      `Laufend je Monat: ${[wartung, lizenz, strom].filter(Boolean).map(euro).join(' + ')} = ${euro(laufend)}`,
      `Je Monat gesamt: ${euro(anteil)} + ${euro(laufend)} = **${euro(monat)}**`,
      `Über ${jahre} Jahre: ${euro(preis)} + ${euro(laufend)} · ${monate} = **${euro(gesamt)}**`,
    ],
  };
}
function monates(m) {
  return `${m} Monate`;
}

// ---------- Budget, Vor- und Nachkalkulation ----------

export function kalkulation(r) {
  const stunden = r.stufe(16, 120, 4);
  const satz = r.wahl([45, 55, 65, 75, 85]);
  const material = r.stufe(300, 4500, 50);
  const kosten = stunden * satz + material;
  const budget = r.ja() ? Math.round((kosten * r.wahl([0.85, 0.9, 0.95, 1.05, 1.1, 1.2])) / 100) * 100 : Math.ceil(kosten / 500) * 500;
  if (r.ja(0.5)) {
    const im = kosten <= budget;
    return {
      titel: 'Machbarkeit mit Budget',
      sp: 'AP1-3-1-3',
      text: `Für die Einrichtung eines Schulungsraums sind **${stunden} Arbeitsstunden** zu je **${satz} €** und Material für **${euro(material)}** geplant. Das Budget beträgt **${euro(budget)}**. Ist das Vorhaben im Budget machbar?`,
      felder: [
        { id: 'k', label: 'Geplante Kosten', erwartet: kosten, ...EUR },
        { id: 'm', label: 'Im Budget?', typ: 'auswahl', erwartet: im ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
        { id: 'd', label: im ? 'Verbleibender Puffer' : 'Fehlbetrag', erwartet: Math.abs(budget - kosten), ...EUR },
      ],
      loesung: [`Arbeit: ${stunden} h · ${satz} € = ${euro(stunden * satz)}`, `Kosten: ${euro(stunden * satz)} + ${euro(material)} = **${euro(kosten)}**`, im ? `${euro(kosten)} ≤ ${euro(budget)} → **machbar**, Puffer ${euro(budget - kosten)}` : `${euro(kosten)} > ${euro(budget)} → **nicht machbar**, es fehlen ${euro(kosten - budget)}`],
    };
  }
  const istStunden = stunden + r.stufe(-8, 24, 4);
  const istMaterial = ct(material * r.wahl([0.95, 1, 1.05, 1.12, 1.2]));
  const ist = istStunden * satz + istMaterial;
  const abw = ct(ist - kosten);
  return {
    titel: 'Vor- und Nachkalkulation',
    sp: 'AP1-3-1-3',
    text: `**Vorkalkulation:** ${stunden} Stunden à ${satz} € und Material für ${euro(material)}.\n**Nachkalkulation:** tatsächlich ${istStunden} Stunden und Material für ${euro(istMaterial)}.\nBerechne beide Summen und die Abweichung (Ist − Soll) in Euro und in Prozent der geplanten Kosten. Runde auf zwei Nachkommastellen.`,
    felder: [
      { id: 'soll', label: 'Vorkalkulation (Soll)', erwartet: kosten, ...EUR },
      { id: 'ist', label: 'Nachkalkulation (Ist)', erwartet: ist, ...EUR },
      { id: 'abw', label: 'Abweichung (Ist − Soll)', erwartet: abw, ...EUR },
      { id: 'proz', label: 'Abweichung in Prozent', erwartet: (abw / kosten) * 100, ...PROZ },
    ],
    loesung: [
      `Soll: ${stunden} · ${satz} € + ${euro(material)} = **${euro(kosten)}**`,
      `Ist: ${istStunden} · ${satz} € + ${euro(istMaterial)} = **${euro(ist)}**`,
      `Abweichung: ${euro(ist)} − ${euro(kosten)} = **${euro(abw)}** (${abw > 0 ? 'Überschreitung' : abw < 0 ? 'Unterschreitung' : 'genau getroffen'})`,
      `In Prozent: ${euro(abw)} ÷ ${euro(kosten)} · 100 = **${z(runde((abw / kosten) * 100, 2), 2)} %**`,
      'Vorkalkulation: vor dem Auftrag, Grundlage für Angebot und Budget. Nachkalkulation: nach Abschluss, mit den tatsächlichen Werten.',
    ],
  };
}

// ---------- Kostenvergleich ----------

export function kostenvergleich(r) {
  const art = r.wahl(['beschaffung', 'beschaffung', 'payperuse', 'makeorbuy']);
  if (art === 'payperuse') {
    const kauf = r.stufe(1800, 9000, 100);
    const wartungJahr = r.stufe(0, 600, 50);
    const jahre = r.wahl([2, 3, 4]);
    const jeNutzung = r.wahl([0.5, 0.8, 1.2, 2.5, 4, 6]);
    const fix = kauf + wartungJahr * jahre;
    // Kauf ist günstiger, sobald Nutzungen · Preis > Kaufkosten
    const grenze = Math.floor(fix / jeNutzung + 1e-9) + 1;
    return {
      titel: 'Kauf oder Pay-per-Use',
      sp: 'AP1-3-2-1',
      text: `Ein Gerät kann gekauft werden (**${euro(kauf)}** plus **${euro(wartungJahr)}** Wartung je Jahr) oder pro Nutzung bezahlt werden (**${euro(jeNutzung)}** je Nutzung). Betrachtet werden **${jahre} Jahre**. Ab wie vielen Nutzungen in diesem Zeitraum lohnt sich der Kauf? (ganze Nutzungen)`,
      felder: [
        { id: 'fix', label: `Kosten Kauf über ${jahre} Jahre`, erwartet: fix, ...EUR },
        { id: 'g', label: 'Kauf ist günstiger ab Nutzungen', erwartet: grenze },
      ],
      loesung: [`Kauf: ${euro(kauf)} + ${jahre} · ${euro(wartungJahr)} = **${euro(fix)}**`, `Gleichstand: ${euro(fix)} ÷ ${euro(jeNutzung)} = ${z(runde(fix / jeNutzung, 2))} Nutzungen`, `Erst wenn Pay-per-Use teurer ist als der Kauf, lohnt sich der Kauf: ab **${grenze}** Nutzungen`],
    };
  }
  if (art === 'makeorbuy') {
    const stunden = r.stufe(80, 400, 10);
    const satzIntern = r.wahl([48, 55, 62, 70]);
    const extern = ct(stunden * satzIntern * r.wahl([0.8, 0.9, 1.1, 1.25, 1.4]) + r.stufe(0, 2000, 250));
    const betreuung = r.stufe(10, 40, 5);
    const intern = stunden * satzIntern;
    const externGes = extern + betreuung * satzIntern;
    const guenstiger = intern < externGes ? 'Eigenleistung' : 'Fremdvergabe';
    return {
      titel: 'Eigenleistung oder Fremdvergabe',
      sp: 'AP1-3-2-1',
      text: `Eine Software kann intern entwickelt werden: **${stunden} Stunden** zu **${satzIntern} €**. Ein Dienstleister bietet sie für **${euro(extern)}** an; dabei fallen intern noch **${betreuung} Stunden** für Abstimmung und Abnahme an. Welche Lösung ist günstiger?`,
      felder: [
        { id: 'i', label: 'Kosten Eigenleistung', erwartet: intern, ...EUR },
        { id: 'e', label: 'Kosten Fremdvergabe gesamt', erwartet: externGes, ...EUR },
        { id: 'w', label: 'Günstiger ist', typ: 'auswahl', erwartet: guenstiger, optionen: ['Eigenleistung', 'Fremdvergabe'] },
      ],
      loesung: [`Eigenleistung: ${stunden} h · ${satzIntern} € = **${euro(intern)}**`, `Fremdvergabe: ${euro(extern)} + ${betreuung} h · ${satzIntern} € = **${euro(externGes)}**`, `Günstiger: **${guenstiger}**`, 'Nicht in der Rechnung: Abhängigkeit vom Dienstleister und Know-how, das nach außen geht bzw. im Haus bleibt.'],
    };
  }
  // Kauf, Leasing, Finanzierung über einen Zeitraum
  const monate = r.wahl([24, 36, 48]);
  const kauf = r.stufe(2400, 12000, 200);
  const leasing = ct((kauf / monate) * r.wahl([1.05, 1.1, 1.15, 1.2]));
  const sonder = r.ja() ? r.stufe(0, 1000, 100) : 0;
  const zinsP = r.wahl([4, 5, 6, 7]);
  const finanzZins = ct(((kauf * zinsP) / 100) * (monate / 12) * 0.55); // vereinfacht: Zinsen laut Angebot
  const restwert = r.ja(0.4) ? r.stufe(200, 1500, 100) : 0;
  const kKauf = kauf - restwert;
  const kLeasing = ct(leasing * monate + sonder);
  const kFinanz = ct(kauf + finanzZins - restwert);
  const werte = { Kauf: kKauf, Leasing: kLeasing, Finanzierung: kFinanz };
  const guenstig = Object.entries(werte).sort((a, b) => a[1] - b[1])[0][0];
  return {
    titel: 'Kauf, Leasing, Finanzierung',
    sp: 'AP1-3-2-1',
    text: `Für ein Gerät liegen drei Angebote über **${monate} Monate** vor:\n- **Kauf:** ${euro(kauf)} sofort${restwert ? `; Wiederverkauf nach ${monate} Monaten für ${euro(restwert)}` : ''}\n- **Leasing:** ${euro(leasing)} je Monat${sonder ? `, einmalige Sonderzahlung ${euro(sonder)}` : ''}; danach Rückgabe\n- **Finanzierung:** Kaufpreis per Kredit, Zinsen insgesamt laut Bank ${euro(finanzZins)}${restwert ? '; Wiederverkauf wie beim Kauf' : ''}\nBerechne die Gesamtkosten und wähle das günstigste Angebot.`,
    felder: [
      { id: 'k', label: 'Kosten Kauf', erwartet: kKauf, ...EUR },
      { id: 'l', label: 'Kosten Leasing', erwartet: kLeasing, ...EUR },
      { id: 'f', label: 'Kosten Finanzierung', erwartet: kFinanz, ...EUR },
      { id: 'w', label: 'Günstigstes Angebot', typ: 'auswahl', erwartet: guenstig, optionen: ['Kauf', 'Leasing', 'Finanzierung'] },
    ],
    loesung: [
      `Kauf: ${euro(kauf)}${restwert ? ` − ${euro(restwert)} Erlös` : ''} = **${euro(kKauf)}**`,
      `Leasing: ${monate} · ${euro(leasing)}${sonder ? ` + ${euro(sonder)}` : ''} = **${euro(kLeasing)}**`,
      `Finanzierung: ${euro(kauf)} + ${euro(finanzZins)} Zinsen${restwert ? ` − ${euro(restwert)}` : ''} = **${euro(kFinanz)}**`,
      `Günstigstes: **${guenstig}**`,
    ],
  };
}

// ---------- Tilgungsplan (Ratendarlehen) ----------

export function tilgung(r) {
  const jahre = r.wahl([3, 4, 5]);
  const darlehen = r.stufe(6000, 60000, 1000 * jahre) ;
  const zins = r.wahl([3, 4, 4.5, 5, 6]);
  const t = darlehen / jahre;
  const zeilen = [];
  let rest = darlehen;
  let summeZins = 0;
  for (let j = 1; j <= jahre; j++) {
    const zinsen = ct((rest * zins) / 100);
    summeZins = ct(summeZins + zinsen);
    zeilen.push({ j, rest, zinsen, tilgung: t, zahlung: ct(zinsen + t), ende: rest - t });
    rest -= t;
  }
  const frage = r.ganz(2, jahre);
  const z2 = zeilen[frage - 1];
  return {
    titel: 'Tilgungsplan',
    sp: 'AP1-3-2-1',
    text: `Ein Darlehen über **${euro(darlehen)}** wird in **${jahre} Jahren** mit **gleichbleibender Tilgung** zurückgezahlt. Der Zinssatz beträgt **${z(zins)} %** pro Jahr auf die Restschuld am Jahresanfang. Ergänze die Zeile für **Jahr ${frage}** und die Summe der Zinsen.`,
    tabelle: {
      kopf: ['Jahr', 'Restschuld Anfang', 'Zinsen', 'Tilgung', 'Zahlung'],
      zeilen: zeilen.map((x) => (x.j === frage ? [x.j, '?', '?', '?', '?'] : [x.j, euro(x.rest), x.j < frage ? euro(x.zinsen) : '…', euro(x.tilgung), x.j < frage ? euro(x.zahlung) : '…'])),
      rechtsbuendig: [1, 2, 3, 4],
    },
    felder: [
      { id: 'rest', label: `Restschuld Anfang Jahr ${frage}`, erwartet: z2.rest, ...EUR },
      { id: 'zins', label: `Zinsen Jahr ${frage}`, erwartet: z2.zinsen, ...EUR },
      { id: 'til', label: 'Tilgung', erwartet: z2.tilgung, ...EUR },
      { id: 'zahl', label: `Zahlung Jahr ${frage}`, erwartet: z2.zahlung, ...EUR },
      { id: 'summe', label: 'Summe aller Zinsen (Finanzierungskosten)', erwartet: summeZins, ...EUR, toleranz: 0.03 },
    ],
    loesung: [
      `Tilgung je Jahr: ${euro(darlehen)} ÷ ${jahre} = **${euro(t)}** (gleichbleibend)`,
      ...zeilen.map((x) => `Jahr ${x.j}: Restschuld ${euro(x.rest)}, Zinsen ${z(zins)} % = ${euro(x.zinsen)}, Zahlung ${euro(x.zahlung)}`),
      `Summe der Zinsen: **${euro(summeZins)}** – das sind die Finanzierungskosten.`,
    ],
  };
}

// ---------- Quantitativer Angebotsvergleich ----------

export function angebot(r) {
  const menge = r.wahl([10, 12, 15, 20, 25]);
  const namen = ['A', 'B', 'C'];
  let angebote;
  let sortiert;
  do {
    angebote = namen.map((n) => {
      const preis = r.stufe(180, 320, 5);
      const rabatt = r.wahl([0, 3, 5, 8, 10]);
      const skonto = r.wahl([0, 2, 3]);
      const versand = r.wahl([0, 0, 25, 49, 89]);
      const listen = preis * menge;
      const nachRabatt = ct(listen * (1 - rabatt / 100));
      const nachSkonto = ct(nachRabatt * (1 - skonto / 100));
      const bezug = ct(nachSkonto + versand);
      return { n, preis, rabatt, skonto, versand, listen, nachRabatt, nachSkonto, bezug };
    });
    sortiert = [...angebote].sort((x, y) => x.bezug - y.bezug);
  } while (sortiert[1].bezug - sortiert[0].bezug < 1);
  const best = sortiert[0].n;
  return {
    titel: 'Angebotsvergleich',
    sp: 'AP1-3-2-2',
    text: `Für **${menge} Monitore** liegen drei Angebote vor (Preise netto). Berechne den Bezugspreis je Angebot: Listenpreis − Rabatt − Skonto + Versand. Welches ist das günstigste?`,
    tabelle: {
      kopf: ['Angebot', 'Preis je Stück', 'Rabatt', 'Skonto', 'Versand'],
      zeilen: angebote.map((a) => [a.n, euro(a.preis), `${a.rabatt} %`, `${a.skonto} %`, a.versand ? euro(a.versand) : 'frei']),
      rechtsbuendig: [1, 2, 3, 4],
    },
    felder: [
      ...angebote.map((a) => ({ id: `b${a.n}`, label: `Bezugspreis ${a.n}`, erwartet: a.bezug, ...EUR, toleranz: 0.02 })),
      { id: 'w', label: 'Günstigstes Angebot', typ: 'auswahl', erwartet: best, optionen: namen },
    ],
    loesung: [
      ...angebote.map((a) => `${a.n}: ${menge} · ${euro(a.preis)} = ${euro(a.listen)} → −${a.rabatt} % = ${euro(a.nachRabatt)} → −${a.skonto} % = ${euro(a.nachSkonto)} → +${euro(a.versand)} = **${euro(a.bezug)}**`),
      `Günstigstes Angebot: **${best}**`,
    ],
  };
}

// ---------- Nutzwertanalyse ----------

const NW_KRITERIEN = [
  ['Preis', 'niedrig'],
  ['Akkulaufzeit', 'hoch'],
  ['Gewicht', 'niedrig'],
  ['Arbeitsspeicher', 'hoch'],
  ['Garantie', 'hoch'],
  ['Lautstärke', 'niedrig'],
];

export function nutzwert(r) {
  const geraete = ['Gerät 1', 'Gerät 2', 'Gerät 3'];
  if (r.ja(0.5)) {
    // gewichtet: Punkte 1–10 gegeben
    const kriterien = r.mische(NW_KRITERIEN).slice(0, 4);
    const gew = r.wahl([
      [40, 30, 20, 10],
      [30, 30, 25, 15],
      [35, 25, 25, 15],
      [25, 25, 25, 25],
      [50, 20, 20, 10],
    ]);
    let punkte;
    let summen2;
    let rang;
    do {
      punkte = kriterien.map(() => geraete.map(() => r.ganz(3, 10)));
      summen2 = geraete.map((_, g) => kriterien.reduce((a, _, k) => a + (gew[k] / 100) * punkte[k][g], 0));
      rang = summen2.map((x, i) => [x, i]).sort((x, y) => y[0] - x[0]);
    } while (rang[0][0] - rang[1][0] < 0.05 || rang[1][0] - rang[2][0] < 0.05);
    const best = geraete[rang[0][1]];
    const ausschluss = r.ja(0.3) ? rang[0][1] : null;
    const sieger = ausschluss === null ? best : geraete[rang[1][1]];
    return {
      titel: 'Nutzwertanalyse (gewichtet)',
      sp: 'AP1-3-2-3',
      text: `Berechne die Nutzwerte: Punkte (1–10, 10 = am besten) mal Gewichtung, je Gerät aufsummiert.${ausschluss !== null ? `\n**Zusatzbedingung:** ${geraete[ausschluss]} ist nicht lieferbar und scheidet aus.` : ''} Welches Gerät wird gewählt?`,
      tabelle: {
        kopf: ['Kriterium', 'Gewichtung', ...geraete],
        zeilen: kriterien.map(([k], i) => [k, `${gew[i]} %`, ...punkte[i].map(String)]),
        rechtsbuendig: [1, 2, 3, 4],
      },
      felder: [...geraete.map((g, i) => ({ id: `n${i}`, label: `Nutzwert ${g}`, erwartet: summen2[i], stellen: 2 })), { id: 'w', label: 'Gewählt wird', typ: 'auswahl', erwartet: sieger, optionen: geraete }],
      loesung: [
        ...geraete.map((g, i) => `${g}: ${kriterien.map((_, k) => `${z(gew[k] / 100)} · ${punkte[k][i]}`).join(' + ')} = **${z(runde(summen2[i], 2), 2)}**`),
        `Höchster Nutzwert: ${best}`,
        ausschluss !== null ? `${best} scheidet wegen der Zusatzbedingung aus → gewählt wird **${sieger}**` : `Gewählt wird **${sieger}**`,
      ],
    };
  }
  // Rangpunkte ohne Gewichtung aus technischen Daten (3 = bester, 1 = schlechtester Wert)
  const kriterien = r.mische(NW_KRITERIEN).slice(0, 4);
  let werte, punkte, summen;
  do {
  werte = kriterien.map(([k]) => {
    const basis = { Preis: [699, 1299, 50], Akkulaufzeit: [6, 16, 1], Gewicht: [1.1, 2.4, 0.1], Arbeitsspeicher: [8, 32, 8], Garantie: [12, 48, 12], Lautstärke: [22, 38, 2] }[k];
    let v;
    do {
      v = geraete.map(() => (k === 'Gewicht' ? runde(basis[0] + r.ganz(0, Math.round((basis[1] - basis[0]) / basis[2])) * basis[2], 1) : r.stufe(basis[0], basis[1], basis[2])));
    } while (new Set(v).size < 3);
    return v;
  });
  punkte = kriterien.map(([, richtung], k) => {
    const sortiert = [...werte[k]].sort((a, b) => (richtung === 'hoch' ? a - b : b - a));
    return werte[k].map((v) => sortiert.indexOf(v) + 1);
  });
  summen = geraete.map((_, g) => punkte.reduce((a, p) => a + p[g], 0));
  } while (summen.filter((x) => x === Math.max(...summen)).length > 1);
  const einheit = { Preis: ' €', Akkulaufzeit: ' h', Gewicht: ' kg', Arbeitsspeicher: ' GB', Garantie: ' Monate', Lautstärke: ' dB' };
  const best = geraete[summen.indexOf(Math.max(...summen))];
  return {
    titel: 'Nutzwertanalyse mit Rangpunkten',
    sp: 'AP1-3-2-3',
    text: `Vergib je Kriterium Rangpunkte: **3** für den besten, **1** für den schlechtesten Wert (bei Preis, Gewicht und Lautstärke ist der niedrigste Wert der beste). Summiere die Punkte je Gerät.`,
    tabelle: {
      kopf: ['Kriterium', ...geraete],
      zeilen: kriterien.map(([k], i) => [k, ...werte[i].map((v) => `${z(v)}${einheit[k]}`)]),
      rechtsbuendig: [1, 2, 3],
    },
    felder: [
      ...geraete.map((g, i) => ({ id: `s${i}`, label: `Punkte ${g}`, erwartet: summen[i] })),
      { id: 'w', label: 'Meiste Punkte', typ: 'auswahl', erwartet: best, optionen: geraete },
    ],
    loesung: [...kriterien.map(([k, ri], i) => `${k} (${ri === 'hoch' ? 'hoch ist gut' : 'niedrig ist gut'}): ${geraete.map((g, j) => `${g} ${punkte[i][j]}`).join(', ')}`), `Summen: ${geraete.map((g, i) => `${g} ${summen[i]}`).join(', ')}`, `Meiste Punkte: **${best}**`],
  };
}

// ---------- Soll-Ist-Vergleich ----------

export function sollist(r) {
  const fall = r.wahl([
    ['Projektaufwand', 'Stunden', 'h', 120, 600, 10],
    ['Projektkosten', 'Euro', '€', 8000, 60000, 500],
    ['Testfälle bis zur Abnahme', 'Testfälle', '', 80, 300, 5],
    ['Durchlaufzeit eines Tickets', 'Stunden', 'h', 8, 48, 1],
    ['gemeldete Fehler im ersten Monat', 'Fehler', '', 20, 80, 1],
  ]);
  const [was, , einheit, min, max, schritt] = fall;
  const soll = r.stufe(min, max, schritt);
  const faktor = r.wahl([0.85, 0.9, 0.95, 1.06, 1.1, 1.12, 1.18, 1.25, 1.3]);
  let ist = Math.round((soll * faktor) / schritt) * schritt;
  if (ist === soll) ist += schritt;
  const abw = ist - soll;
  const proz = (abw / soll) * 100;
  const eh = einheit === '€' ? { ...EUR } : { stellen: 0, einheit };
  return {
    titel: 'Soll-Ist-Vergleich',
    sp: 'AP2-5-5-2',
    text: `Geplant (Soll): **${z(soll)}${einheit ? ' ' + einheit : ''}** · tatsächlich (Ist): **${z(ist)}${einheit ? ' ' + einheit : ''}** – Kennzahl: ${was}.\nBerechne die Abweichung (Ist − Soll, mit Vorzeichen) und die Abweichung in Prozent des Soll-Werts (zwei Nachkommastellen).`,
    felder: [
      { id: 'abw', label: 'Abweichung', erwartet: abw, ...eh },
      { id: 'proz', label: 'Abweichung in %', erwartet: proz, ...PROZ },
    ],
    loesung: [`Abweichung = Ist − Soll = ${z(ist)} − ${z(soll)} = **${z(abw)}**`, `In Prozent = Abweichung ÷ Soll · 100 = ${z(abw)} ÷ ${z(soll)} · 100 = **${z(runde(proz, 2), 2)} %**`, abw > 0 ? 'Positiv: Das Soll wurde überschritten.' : 'Negativ: Das Soll wurde unterschritten.'],
  };
}

// ---------- WiSo: Sozialversicherung ----------

export function sv(r) {
  const brutto = r.ja(0.2) ? r.stufe(6000, 9500, 50) : ct(r.stufe(1100, 4800, 25) + (r.ja() ? 0.5 : 0));
  const zusatz = r.wahl([2.5, 2.7, 2.9, 3.1]);
  const bbgKv = 5812.5;
  const bbgRv = 8450;
  const kinderlos = r.ja(0.4);
  const alter = kinderlos ? r.wahl([19, 22, 25, 31]) : r.wahl([20, 28, 35]);
  const pvZuschlag = kinderlos && alter >= 23;
  const kvBasis = Math.min(brutto, bbgKv);
  const rvBasis = Math.min(brutto, bbgRv);
  const kv = ct((kvBasis * (14.6 / 2 + zusatz / 2)) / 100);
  const pv = ct((kvBasis * (3.6 / 2 + (pvZuschlag ? 0.6 : 0))) / 100);
  const rv = ct((rvBasis * 18.6) / 2 / 100);
  const av = ct((rvBasis * 2.6) / 2 / 100);
  const art = r.wahl(['kv', 'kv', 'alle']);
  const kopf = `Werte laut Aufgabe: allgemeiner KV-Beitragssatz 14,6 %, durchschnittlicher Zusatzbeitrag **${z(zusatz)} %**, PV 3,6 % (Zuschlag für Kinderlose ab 23 Jahren 0,6 %, trägt der Arbeitnehmer allein), RV 18,6 %, AV 2,6 %. Beitragsbemessungsgrenzen je Monat: KV/PV ${euro(bbgKv)}, RV/AV ${euro(bbgRv)}. Arbeitgeber und Arbeitnehmer tragen die Beiträge je zur Hälfte (Bundesland außer Sachsen).`;
  if (art === 'kv')
    return {
      titel: 'Arbeitnehmeranteil Krankenversicherung',
      sp: 'WISO-1-6-3',
      text: `Ein Arbeitnehmer verdient **${euro(brutto)}** brutto im Monat. Berechne seinen Anteil zur Krankenversicherung auf den Cent genau.\n${kopf}`,
      felder: [{ id: 'kv', label: 'AN-Anteil KV', erwartet: kv, ...EUR, toleranz: 0.005 }],
      loesung: [
        brutto > bbgKv ? `Das Entgelt liegt über der BBG → Beitrag nur von ${euro(bbgKv)}` : `Bemessungsgrundlage: ${euro(brutto)}`,
        `AN-Satz: 14,6 % ÷ 2 + ${z(zusatz)} % ÷ 2 = ${z(7.3 + zusatz / 2)} %`,
        `${euro(kvBasis)} · ${z(7.3 + zusatz / 2)} % = **${euro(kv)}**`,
      ],
    };
  return {
    titel: 'Sozialversicherung – Arbeitnehmeranteile',
    sp: 'WISO-1-6-3',
    text: `Eine Arbeitnehmerin, **${alter} Jahre**, ${kinderlos ? '**kinderlos**' : 'mit einem Kind'}, verdient **${euro(brutto)}** brutto. Berechne ihre Anteile zu den vier Versicherungen.\n${kopf}`,
    felder: [
      { id: 'kv', label: 'Krankenversicherung', erwartet: kv, ...EUR, toleranz: 0.005 },
      { id: 'pv', label: 'Pflegeversicherung', erwartet: pv, ...EUR, toleranz: 0.005 },
      { id: 'rv', label: 'Rentenversicherung', erwartet: rv, ...EUR, toleranz: 0.005 },
      { id: 'av', label: 'Arbeitslosenversicherung', erwartet: av, ...EUR, toleranz: 0.005 },
      { id: 'sum', label: 'Summe', erwartet: ct(kv + pv + rv + av), ...EUR, toleranz: 0.02 },
    ],
    loesung: [
      `KV: ${euro(kvBasis)} · ${z(7.3 + zusatz / 2)} % = ${euro(kv)}`,
      `PV: ${euro(kvBasis)} · ${z(1.8 + (pvZuschlag ? 0.6 : 0))} % = ${euro(pv)}${pvZuschlag ? ' (mit Kinderlosenzuschlag, da ab 23 und kinderlos)' : kinderlos ? ' (kein Zuschlag: unter 23 Jahre)' : ''}`,
      `RV: ${euro(rvBasis)} · 9,3 % = ${euro(rv)}`,
      `AV: ${euro(rvBasis)} · 1,3 % = ${euro(av)}`,
      `Summe: **${euro(ct(kv + pv + rv + av))}**`,
    ],
  };
}

// ---------- WiSo: Gewinnverteilung GmbH ----------

export function gewinn(r) {
  const stamm = r.wahl([25000, 50000, 60000, 100000, 120000]);
  const n = r.ganz(2, 4);
  const anteile = [];
  let rest = stamm;
  for (let i = 0; i < n - 1; i++) {
    const a = Math.max(5000, Math.round((rest * r.wahl([0.2, 0.25, 0.3, 0.4, 0.5])) / 1000) * 1000);
    anteile.push(a);
    rest -= a;
  }
  anteile.push(rest);
  const namen = ['Frau Albers', 'Herr Becker', 'Frau Celik', 'Herr Dahl'].slice(0, n);
  const gewinnSumme = r.stufe(30000, 480000, 1000);
  const wer = r.ganz(0, n - 1);
  const anteil = gewinnSumme * (anteile[wer] / stamm);
  return {
    titel: 'Gewinnverteilung in der GmbH',
    sp: 'WISO-2-2-3',
    text: `Die GmbH hat ein Stammkapital von **${euro(stamm)}** und einen Gewinn von **${euro(gewinnSumme)}**, der vollständig ausgeschüttet wird. Der Gesellschaftsvertrag regelt die Verteilung nicht.\n${namen.map((nm, i) => `- ${nm}: Geschäftsanteil ${euro(anteile[i])}`).join('\n')}\nWie viel erhält **${namen[wer]}**?`,
    felder: [
      { id: 'p', label: `Anteil am Stammkapital`, erwartet: (anteile[wer] / stamm) * 100, ...PROZ },
      { id: 'g', label: `Gewinnanteil ${namen[wer]}`, erwartet: anteil, ...EUR },
    ],
    loesung: [`Ohne Regelung im Vertrag: Verteilung nach dem Verhältnis der Geschäftsanteile.`, `Anteil: ${euro(anteile[wer])} ÷ ${euro(stamm)} = ${z(runde((anteile[wer] / stamm) * 100, 2), 2)} %`, `Gewinnanteil: ${euro(gewinnSumme)} · ${z(runde((anteile[wer] / stamm) * 100, 2), 2)} % = **${euro(ct(anteil))}**`, 'Probe: Die Anteile aller Gesellschafter ergeben zusammen den Gewinn.'],
  };
}

// ---------- WiSo: Kennzahlen ----------

export function kennzahlen(r) {
  const art = r.wahl(['produktivitaet', 'wirtschaftlichkeit', 'ekr', 'umsatz', 'gkr']);
  if (art === 'produktivitaet') {
    const stueck = r.stufe(800, 12000, 50);
    const stunden = r.stufe(40, 800, 10);
    return {
      titel: 'Produktivität',
      sp: 'WISO-2-4-1',
      text: `In einem Monat werden **${z(stueck)} Geräte** eingerichtet; dafür werden **${z(stunden)} Arbeitsstunden** eingesetzt. Wie hoch ist die Arbeitsproduktivität (Stück je Stunde, zwei Nachkommastellen)?`,
      felder: [{ id: 'x', label: 'Produktivität', erwartet: stueck / stunden, stellen: 2, einheit: 'Stück/h' }],
      loesung: ['Produktivität = Ausbringungsmenge ÷ Einsatzmenge (Mengen, keine Euro)', `${z(stueck)} ÷ ${z(stunden)} = **${z(runde(stueck / stunden, 2), 2)} Stück je Stunde**`],
    };
  }
  if (art === 'wirtschaftlichkeit') {
    const aufwand = r.stufe(200000, 2000000, 10000);
    const ertrag = Math.round(aufwand * r.wahl([0.92, 0.97, 1.04, 1.08, 1.15, 1.22]));
    return {
      titel: 'Wirtschaftlichkeit',
      sp: 'WISO-2-4-1',
      text: `Ein Unternehmen hat Erträge von **${euro(ertrag)}** und Aufwendungen von **${euro(aufwand)}**. Berechne die Wirtschaftlichkeit (zwei Nachkommastellen). Arbeitet es wirtschaftlich?`,
      felder: [
        { id: 'x', label: 'Wirtschaftlichkeit', erwartet: ertrag / aufwand, stellen: 2 },
        { id: 'w', label: 'Wirtschaftlich?', typ: 'auswahl', erwartet: ertrag > aufwand ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
      ],
      loesung: ['Wirtschaftlichkeit = Ertrag ÷ Aufwand', `${euro(ertrag)} ÷ ${euro(aufwand)} = **${z(runde(ertrag / aufwand, 2), 2)}**`, ertrag > aufwand ? 'Über 1: Der Ertrag übersteigt den Aufwand → wirtschaftlich.' : 'Unter 1: Der Aufwand übersteigt den Ertrag → unwirtschaftlich.'],
    };
  }
  if (art === 'ekr') {
    const ek = r.stufe(100000, 2000000, 25000);
    const g = Math.round(ek * r.wahl([0.03, 0.05, 0.08, 0.12, 0.15]) + r.stufe(-5000, 5000, 500));
    return {
      titel: 'Eigenkapitalrentabilität',
      sp: 'WISO-2-4-1',
      text: `Gewinn: **${euro(g)}** · Eigenkapital: **${euro(ek)}**. Berechne die Eigenkapitalrentabilität in Prozent (zwei Nachkommastellen).`,
      felder: [{ id: 'x', label: 'EK-Rentabilität', erwartet: (g * 100) / ek, ...PROZ }],
      loesung: ['EK-Rentabilität = Gewinn · 100 ÷ Eigenkapital', `${euro(g)} · 100 ÷ ${euro(ek)} = **${z(runde((g * 100) / ek, 2), 2)} %**`],
    };
  }
  if (art === 'umsatz') {
    const umsatz = r.stufe(500000, 9000000, 50000);
    const g = Math.round(umsatz * r.wahl([0.02, 0.04, 0.06, 0.09]));
    return {
      titel: 'Umsatzrentabilität',
      sp: 'WISO-2-4-1',
      text: `Gewinn: **${euro(g)}** · Umsatz: **${euro(umsatz)}**. Berechne die Umsatzrentabilität in Prozent (zwei Nachkommastellen).`,
      felder: [{ id: 'x', label: 'Umsatzrentabilität', erwartet: (g * 100) / umsatz, ...PROZ }],
      loesung: ['Umsatzrentabilität = Gewinn · 100 ÷ Umsatz', `${euro(g)} · 100 ÷ ${euro(umsatz)} = **${z(runde((g * 100) / umsatz, 2), 2)} %**`],
    };
  }
  const ek = r.stufe(200000, 1500000, 50000);
  const fk = r.stufe(100000, 1500000, 50000);
  const zinsen = Math.round(fk * r.wahl([0.03, 0.04, 0.05, 0.06]));
  const g = Math.round((ek + fk) * r.wahl([0.03, 0.05, 0.07]));
  return {
    titel: 'Gesamtkapitalrentabilität',
    sp: 'WISO-2-4-1',
    text: `Eigenkapital **${euro(ek)}**, Fremdkapital **${euro(fk)}**, Gewinn **${euro(g)}**, gezahlte Fremdkapitalzinsen **${euro(zinsen)}**. Berechne die Gesamtkapitalrentabilität in Prozent (zwei Nachkommastellen).`,
    felder: [{ id: 'x', label: 'GK-Rentabilität', erwartet: ((g + zinsen) * 100) / (ek + fk), ...PROZ }],
    loesung: ['GK-Rentabilität = (Gewinn + Fremdkapitalzinsen) · 100 ÷ Gesamtkapital', `Gesamtkapital: ${euro(ek)} + ${euro(fk)} = ${euro(ek + fk)}`, `(${euro(g)} + ${euro(zinsen)}) · 100 ÷ ${euro(ek + fk)} = **${z(runde(((g + zinsen) * 100) / (ek + fk), 2), 2)} %**`],
  };
}

export const ERZEUGER = { rechnung, nutzungsdauer, kalkulation, kostenvergleich, tilgung, angebot, nutzwert, sollist, sv, gewinn, kennzahlen };
