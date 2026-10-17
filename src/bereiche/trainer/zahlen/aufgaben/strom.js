// Aufgaben „Leistung und Stromkosten“: P = U · I, Netzteil, Wirkungsgrad, Energie und Kosten, Mehrfachsteckdose,
// USB-Anschluss, Gesamtwirkungsgrad.

import { z, runde } from '../rechnen.js';

export const ARTEN = [
  { id: 'pui', name: 'P = U · I' },
  { id: 'netzteil', name: 'Netzteil wählen' },
  { id: 'wirkungsgrad', name: 'Wirkungsgrad' },
  { id: 'kosten', name: 'Energie & Kosten' },
  { id: 'jahr', name: 'Stromkosten im Jahr' },
  { id: 'steckdose', name: 'Mehrfachsteckdose' },
  { id: 'usb', name: 'USB-Anschluss' },
  { id: 'gesamt', name: 'Gesamtwirkungsgrad' },
];

const mit2 = (wert) => z(runde(wert, 2), 2);
const NETZTEILE = [300, 350, 400, 450, 500, 550, 650, 750];
const STECKDOSE_W = 16 * 230;

export function erzeuge(r, art) {
  switch (art) {
    case 'pui':
      return pui(r);
    case 'netzteil':
      return netzteil(r);
    case 'wirkungsgrad':
      return wirkungsgrad(r);
    case 'kosten':
      return kosten(r);
    case 'jahr':
      return jahr(r);
    case 'steckdose':
      return steckdose(r);
    case 'usb':
      return usb(r);
    default:
      return gesamt(r);
  }
}

function pui(r) {
  const u = r.wahl([5, 12, 24, 230]);
  const i = u === 230 ? r.wahl([0.2, 0.5, 1.5, 2, 4.5]) : r.wahl([0.5, 1.5, 2, 3, 4.5, 8]);
  const p = u * i;
  const gesucht = r.wahl(['P', 'I', 'U']);
  const formel = 'Grundformel: P = U · I (Watt = Volt · Ampere).';
  if (gesucht === 'P') {
    return {
      text: `Ein Gerät wird mit **${u} V** betrieben und nimmt **${z(i)} A** auf. Welche Leistung nimmt es auf?`,
      felder: [{ id: 'x', label: 'Leistung P', erwartet: p, stellen: 1, einheit: 'W' }],
      loesung: [formel, `P = ${u} V · ${z(i)} A = **${z(p)} W**`],
    };
  }
  if (gesucht === 'I') {
    return {
      text: `Ein Gerät mit **${z(p)} W** Leistungsaufnahme wird an **${u} V** betrieben. Welcher Strom fließt? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Stromstärke I', erwartet: i, stellen: 2, einheit: 'A' }],
      loesung: [formel, `Umgestellt: I = P ÷ U = ${z(p)} W ÷ ${u} V = **${mit2(i)} A**`],
    };
  }
  return {
    text: `Ein Gerät nimmt **${z(p)} W** bei **${z(i)} A** auf. Mit welcher Spannung wird es betrieben?`,
    felder: [{ id: 'x', label: 'Spannung U', erwartet: u, einheit: 'V' }],
    loesung: [formel, `Umgestellt: U = P ÷ I = ${z(p)} W ÷ ${z(i)} A = **${u} V**`],
  };
}

function netzteil(r) {
  const teile = [
    ['Prozessor', r.wahl([65, 95, 105, 125])],
    ['Grafikkarte', r.wahl([75, 120, 170, 220, 285])],
    ['Mainboard', r.wahl([30, 40, 50])],
    ['Arbeitsspeicher', r.wahl([8, 10, 16])],
    ['SSD', r.wahl([5, 6, 8])],
    ['Lüfter und Sonstiges', r.wahl([10, 15, 20])],
  ];
  const summe = teile.reduce((a, [, w]) => a + w, 0);
  const zuschlag = r.wahl([20, 25, 30]);
  const bedarf = summe * (1 + zuschlag / 100);
  const passend = NETZTEILE.find((n) => n >= bedarf);
  return {
    text: `Die Komponenten eines PCs nehmen höchstens die Leistung in der Tabelle auf. Als Reserve sollen **${zuschlag} %** Zuschlag eingerechnet werden. Wie groß ist der Leistungsbedarf, und welches Netzteil ist das kleinste passende?`,
    tabelle: { kopf: ['Komponente', 'Leistung'], zeilen: teile.map(([n, w]) => [n, `${w} W`]), rechtsbuendig: [1] },
    felder: [
      { id: 'summe', label: 'Summe der Komponenten', erwartet: summe, einheit: 'W' },
      { id: 'bedarf', label: `Bedarf mit ${zuschlag} % Zuschlag`, erwartet: bedarf, stellen: 1, einheit: 'W' },
      { id: 'netzteil', label: 'Kleinstes passendes Netzteil', typ: 'auswahl', erwartet: String(passend), optionen: NETZTEILE.map((n) => ({ wert: String(n), text: `${n} W` })) },
    ],
    loesung: [`Summe: ${teile.map(([, w]) => w).join(' + ')} = ${summe} W`, `Mit Zuschlag: ${summe} W · ${z(1 + zuschlag / 100)} = ${z(runde(bedarf, 1))} W`, `Das kleinste Netzteil, das mindestens ${z(runde(bedarf, 1))} W liefert: **${passend} W**`],
  };
}

function wirkungsgrad(r) {
  const pab = r.wahl([150, 200, 300, 350, 450]);
  const eta = r.wahl([80, 85, 88, 90, 92]);
  const pauf = pab / (eta / 100);
  return {
    text: `Ein Netzteil gibt **${pab} W** an die Komponenten ab und hat einen Wirkungsgrad von **${eta} %**. Welche Leistung nimmt es aus dem Stromnetz auf? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'Aufgenommene Leistung', erwartet: pauf, stellen: 2, einheit: 'W' }],
    loesung: ['Wirkungsgrad η = abgegebene Leistung ÷ aufgenommene Leistung.', `Aufgenommen = abgegeben ÷ η = ${pab} W ÷ ${z(eta / 100)} = **${mit2(pauf)} W**`, `Die Differenz von ${mit2(pauf - pab)} W wird zu Wärme.`],
  };
}

function kosten(r) {
  const w = r.wahl([5, 12, 45, 65, 150, 400, 650]);
  const std = r.wahl([2, 4.5, 8, 24, 30, 100]);
  const preis = r.wahl([0.29, 0.31, 0.34, 0.36]);
  const kwh = (w * std) / 1000;
  return {
    text: `Ein Gerät mit **${w} W** läuft **${z(std)} Stunden**. Wie viel Energie verbraucht es in **kWh**, und was kostet das bei **${z(preis, 2)} €/kWh**? Runde die Energie auf drei, die Kosten auf zwei Nachkommastellen.`,
    felder: [
      { id: 'kwh', label: 'Energie', erwartet: kwh, stellen: 3, einheit: 'kWh' },
      { id: 'eur', label: 'Kosten', erwartet: kwh * preis, stellen: 2, einheit: '€', toleranz: 0.011 },
    ],
    loesung: [`W = P · t = ${w} W · ${z(std)} h = ${z(w * std)} Wh`, `In kWh (÷ 1.000): **${z(runde(kwh, 3), 3)} kWh**`, `Kosten: ${z(kwh)} kWh · ${z(preis, 2)} €/kWh = **${mit2(kwh * preis)} €**`],
  };
}

function jahr(r) {
  const preis = r.wahl([0.28, 0.3, 0.32, 0.35, 0.38]);
  if (r.ja(0.4)) {
    // Teilweise Auslastung: Last und Leerlauf getrennt rechnen
    const tage = r.wahl([220, 250]);
    const lastStd = r.wahl([6, 8, 10]);
    const pLast = r.wahl([120, 180, 250, 400]);
    const pLeer = r.wahl([30, 40, 60, 80]);
    const whTag = pLast * lastStd + pLeer * (24 - lastStd);
    const kwh = (whTag * tage) / 1000;
    return {
      text:
        `Ein Server nimmt unter Last **${pLast} W** auf, im Leerlauf **${pLeer} W**. An **${tage} Tagen** im Jahr läuft er je **${lastStd} h** unter Last und die übrigen **${24 - lastStd} h** im Leerlauf; an den anderen Tagen ist er aus. ` +
        `Der Strom kostet **${z(preis, 2)} €/kWh**. Berechne den Energiebedarf und die Stromkosten im Jahr. Runde auf zwei Nachkommastellen.`,
      felder: [
        { id: 'kwh', label: 'Energie', erwartet: kwh, stellen: 2, einheit: 'kWh' },
        { id: 'eur', label: 'Kosten', erwartet: kwh * preis, stellen: 2, einheit: '€', toleranz: 0.011 },
      ],
      loesung: [
        `Je Tag: ${pLast} W · ${lastStd} h + ${pLeer} W · ${24 - lastStd} h = ${z(pLast * lastStd)} Wh + ${z(pLeer * (24 - lastStd))} Wh = ${z(whTag)} Wh`,
        `Im Jahr: ${z(whTag)} Wh · ${tage} = ${z(whTag * tage)} Wh = **${mit2(kwh)} kWh**`,
        `Kosten: ${mit2(kwh)} kWh · ${z(preis, 2)} €/kWh = **${mit2(kwh * preis)} €**`,
      ],
    };
  }
  const w = r.wahl([35, 60, 90, 120, 180]);
  const std = r.wahl([8, 10, 24]);
  const tage = std === 24 ? 365 : r.wahl([220, 230, 250]);
  const kwh = (w * std * tage) / 1000;
  return {
    text: `Ein Gerät nimmt **${w} W** auf und läuft **${std} Stunden** an **${tage} Tagen** im Jahr. Der Strom kostet **${z(preis, 2)} €/kWh**. Berechne den Energiebedarf und die Stromkosten im Jahr. Runde auf zwei Nachkommastellen.`,
    felder: [
      { id: 'kwh', label: 'Energie', erwartet: kwh, stellen: 2, einheit: 'kWh' },
      { id: 'eur', label: 'Kosten', erwartet: kwh * preis, stellen: 2, einheit: '€', toleranz: 0.011 },
    ],
    loesung: [`Betriebsstunden: ${std} h · ${tage} = ${z(std * tage)} h`, `W = P · t = ${w} W · ${z(std * tage)} h = ${z(w * std * tage)} Wh = **${mit2(kwh)} kWh**`, `Kosten: ${mit2(kwh)} kWh · ${z(preis, 2)} €/kWh = **${mit2(kwh * preis)} €**`],
  };
}

const GERAETE = [
  ['Heizlüfter', 2000],
  ['Wasserkocher', 1800],
  ['Kaffeemaschine', 1200],
  ['Staubsauger', 900],
  ['Drucker (Laser)', 600],
  ['PC', 450],
  ['Monitor', 40],
  ['Ladegerät', 65],
];

function steckdose(r) {
  let geraete;
  let summe;
  // Geräte so ziehen, dass die Entscheidung eindeutig ist (mindestens 100 W Abstand zur Grenze)
  do {
    geraete = r.mische(GERAETE).slice(0, r.ganz(3, 4));
    summe = geraete.reduce((a, [, w]) => a + w, 0);
  } while (Math.abs(summe - STECKDOSE_W) < 100);
  const zuViel = summe > STECKDOSE_W;
  return {
    text: 'An einer Mehrfachsteckdose (abgesichert mit **16 A** bei **230 V**) hängen die Geräte in der Tabelle. Welche Leistung ist zulässig, wie viel nehmen die Geräte zusammen auf, und ist die Steckdose überlastet?',
    tabelle: { kopf: ['Gerät', 'Leistungsaufnahme'], zeilen: geraete.map(([n, w]) => [n, `${z(w)} W`]), rechtsbuendig: [1] },
    felder: [
      { id: 'zulaessig', label: 'Zulässige Leistung', erwartet: STECKDOSE_W, einheit: 'W' },
      { id: 'summe', label: 'Summe der Geräte', erwartet: summe, einheit: 'W' },
      { id: 'ueberlastet', label: 'Überlastet?', typ: 'auswahl', erwartet: zuViel ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
    ],
    loesung: [
      `Zulässig: P = U · I = 230 V · 16 A = **${z(STECKDOSE_W)} W**`,
      `Summe: ${geraete.map(([, w]) => w).join(' + ')} = **${z(summe)} W**`,
      zuViel ? `${z(summe)} W > ${z(STECKDOSE_W)} W → **überlastet**, die Sicherung löst aus.` : `${z(summe)} W ≤ ${z(STECKDOSE_W)} W → **nicht überlastet**.`,
    ],
  };
}

const USB = [
  ['USB 2.0', 0.5],
  ['USB 3.0', 0.9],
  ['USB-Ladeanschluss', 1.5],
  ['USB-C', 3],
];

function usb(r) {
  const p = r.wahl([3, 4, 6, 7, 10, 12, 14]);
  const [anschluss, imax] = r.wahl(USB);
  const i = p / 5;
  const passt = i <= imax;
  return {
    text: `Ein Gerät braucht **${p} W** und wird an einem **${anschluss}**-Anschluss mit **5 V** betrieben, der höchstens **${z(imax)} A** liefert. Welchen Strom braucht das Gerät? Reicht der Anschluss? Runde auf zwei Nachkommastellen.`,
    felder: [
      { id: 'strom', label: 'Benötigter Strom', erwartet: i, stellen: 2, einheit: 'A' },
      { id: 'reicht', label: 'Reicht der Anschluss?', typ: 'auswahl', erwartet: passt ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
    ],
    loesung: [
      `I = P ÷ U = ${p} W ÷ 5 V = **${mit2(i)} A**`,
      passt ? `${mit2(i)} A ≤ ${z(imax)} A → **der Anschluss reicht**.` : `${mit2(i)} A > ${z(imax)} A → **der Anschluss reicht nicht**: Das Gerät bekommt zu wenig Strom und arbeitet gestört oder gar nicht.`,
    ],
  };
}

function gesamt(r) {
  const eta1 = r.wahl([85, 90, 92, 95]);
  const eta2 = r.wahl([80, 85, 90, 94]);
  const pab = r.wahl([200, 300, 400, 500]);
  const etaGesamt = (eta1 / 100) * (eta2 / 100);
  const pauf = pab / etaGesamt;
  return {
    text: `Ein Netzteil (Wirkungsgrad **${eta1} %**) versorgt einen nachgeschalteten Spannungswandler (Wirkungsgrad **${eta2} %**), der die Komponenten mit **${pab} W** versorgt. Wie groß ist der Gesamtwirkungsgrad in Prozent, und welche Leistung wird aus dem Netz aufgenommen? Runde auf zwei Nachkommastellen.`,
    felder: [
      { id: 'eta', label: 'Gesamtwirkungsgrad', erwartet: etaGesamt * 100, stellen: 2, einheit: '%' },
      { id: 'pauf', label: 'Aufgenommene Leistung', erwartet: pauf, stellen: 2, einheit: 'W' },
    ],
    loesung: [
      'Hintereinandergeschaltete Stufen: Die Wirkungsgrade werden multipliziert.',
      `η = ${z(eta1 / 100)} · ${z(eta2 / 100)} = ${z(etaGesamt)} = **${mit2(etaGesamt * 100)} %**`,
      `Aufgenommen = abgegeben ÷ η = ${pab} W ÷ ${z(etaGesamt)} = **${mit2(pauf)} W**`,
    ],
  };
}
