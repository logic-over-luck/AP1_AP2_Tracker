import { useCallback } from 'preact/hooks';
import { TrainerSeite, Uebung } from '../rahmen/Uebung.jsx';
import { ERZEUGER } from './aufgaben.js';

const SPICKZETTEL = {
  rechnung: '- Warenwert = Σ Menge · Einzelpreis\n- − Rabatt → Nettobetrag\n- + 19 % Umsatzsteuer → Rechnungsbetrag (brutto)\n- − Skonto (nur bei Zahlung in der Frist) → Zahlbetrag\n- Pflichtangaben: Rechnungsnummer, Datum, Leistung, Steuersatz, Steuerbetrag …',
  nutzungsdauer: '- Kaufpreis je Monat = Kaufpreis ÷ Nutzungsdauer in Monaten\n- + laufende Kosten (Wartung, Lizenzen, Strom)\n- Ausgefallene Arbeitszeit ist auch ein Kostenfaktor (Stunden · Stundensatz)',
  kalkulation: '- Kosten = Stunden · Stundensatz + Material\n- Vorkalkulation: vor dem Auftrag (Soll) · Nachkalkulation: danach (Ist)\n- Abweichung = Ist − Soll · in % = Abweichung ÷ Soll · 100',
  kostenvergleich: '- Leasing: Rate · Monate + Sonderzahlung\n- Kauf: Preis − Erlös beim Wiederverkauf\n- Finanzierung: Preis + Zinsen\n- Pay-per-Use lohnt bis: Kaufkosten ÷ Preis je Nutzung\n- Make or buy: interne Stunden · Satz gegen Angebot + interner Aufwand',
  tilgung: '- Ratendarlehen: Tilgung = Darlehen ÷ Laufzeit (gleichbleibend)\n- Zinsen = Restschuld am Jahresanfang · Zinssatz\n- Zahlung = Zinsen + Tilgung (sinkt jedes Jahr)\n- Finanzierungskosten = Summe der Zinsen',
  angebot: '- Listenpreis = Menge · Stückpreis\n- − Rabatt, − Skonto, + Bezugskosten (Versand) = Bezugspreis\n- Vergleich auf gemeinsamer Basis (gleiche Menge, gleicher Zeitraum)',
  nutzwert: '- Gewichtete Punkte = Gewichtung · Punkte, je Gerät summieren\n- Rangpunkte: bester Wert 3, schlechtester 1\n- Bei Kosten, Gewicht, Lautstärke: niedrig ist gut\n- K.-o.-Bedingung schließt aus, auch bei meisten Punkten',
  sollist: '- Abweichung = Ist − Soll\n- in Prozent = (Ist − Soll) ÷ Soll · 100\n- positiv: überschritten · negativ: unterschritten',
  sv: '- AN-Anteil KV = Brutto · (14,6 % ÷ 2 + Zusatzbeitrag ÷ 2)\n- PV: Hälfte, Kinderlosenzuschlag (ab 23) trägt der AN allein\n- RV und AV: je Hälfte\n- Über der Beitragsbemessungsgrenze kein Beitrag\n- Netto = Brutto − Steuern − SV-Beiträge',
  gewinn: '- Ohne Regelung im Gesellschaftsvertrag: Verteilung nach dem Verhältnis der Geschäftsanteile (§ 29 GmbHG)\n- Anteil = Geschäftsanteil ÷ Stammkapital\n- Probe: Summe aller Anteile = Gewinn',
  kennzahlen: '- Produktivität = Ausbringungsmenge ÷ Einsatzmenge\n- Wirtschaftlichkeit = Ertrag ÷ Aufwand (> 1 = wirtschaftlich)\n- EK-Rentabilität = Gewinn · 100 ÷ Eigenkapital\n- Umsatzrentabilität = Gewinn · 100 ÷ Umsatz\n- GK-Rentabilität = (Gewinn + FK-Zinsen) · 100 ÷ Gesamtkapital',
};

export function KaufmaennischTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => <KUebung key={m.id} modus={m} />}
    </TrainerSeite>
  );
}

function KUebung({ modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng), [modus.id]);
  return <Uebung erzeuge={erzeuge} trainerId="kaufmaennisch" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} />;
}
