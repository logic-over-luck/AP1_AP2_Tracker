// Block 4 – Leistung und Stromkosten: elektrische Leistung (P = U · I, Netzteil, Wirkungsgrad), Energie und Kosten.

import { useState } from 'preact/hooks';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Werkbank, Beispiele } from '../../../lernweg/bausteine.jsx';
import { Rechenweg, ZahlFeld, Wahl, tausend } from '../bausteine.jsx';

const zwei = (x) => tausend(Math.round(x * 100) / 100, 2);
const rund = (x) => tausend(Math.round(x * 100) / 100);

// ---------- 12 Elektrische Leistung ----------

function LeistungErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Spannung, Strom, Leistung',
          inhalt: (
            <>
              <Absatz>Drei Größen beschreiben, was in einer Leitung passiert. Am leichtesten merkt man sie sich mit einem Wasserschlauch:</Absatz>
              <Fakten>
                <Fakt titel="Spannung U in Volt (V)" icon="gauge">
                  der Druck im Schlauch – Steckdose 230 V, USB 5 V, im PC 12 V
                </Fakt>
                <Fakt titel="Stromstärke I in Ampere (A)" icon="droplets">
                  wie viel durchfließt
                </Fakt>
                <Fakt titel="Leistung P in Watt (W)" icon="zap">
                  was dabei an Arbeit je Sekunde geleistet wird – Druck und Menge zusammen
                </Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: 'P = U · I',
          inhalt: (
            <>
              <Absatz>Die Leistung ist Spannung mal Stromstärke. Die Einheiten passen genauso zusammen: Watt = Volt · Ampere.</Absatz>
              <Formel>P = U · I</Formel>
              <Absatz>Beispiel: Ein Gerät im PC bekommt 12 V und zieht 5 A.</Absatz>
              <Formel>P = 12 V · 5 A = 60 W</Formel>
              <Raten
                frage="Ein Notebook-Netzteil liefert 19 V bei 3,42 A. Welche Leistung ist das?"
                optionen={['22,42 W', '65 W', '5,56 W', '650 W']}
                richtig="65 W"
                hinweis={(v) => (v === '22,42 W' ? 'Nicht addieren – malnehmen.' : v === '5,56 W' ? 'Nicht teilen – malnehmen.' : 'Stell das Komma richtig: 19 · 3,42.')}
              >
                <Formel>19 V · 3,42 A = 64,98 W ≈ 65 W</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Umstellen nach U oder I',
          inhalt: (
            <>
              <Absatz>
                Ist die Leistung bekannt, aber Spannung oder Strom gesucht, stellt man um. Merkhilfe: Das <strong>Formeldreieck</strong> – den gesuchten Wert zuhalten, der Rest
                zeigt die Rechnung.
              </Absatz>
              <div class="zl-dreieck" aria-label="Formeldreieck: P oben, U und I unten">
                <span class="zl-dreieck__p">P</span>
                <span class="zl-dreieck__u">U</span>
                <span class="zl-dreieck__mal">·</span>
                <span class="zl-dreieck__i">I</span>
              </div>
              <Fakten>
                <Fakt titel="P gesucht">P = U · I</Fakt>
                <Fakt titel="I gesucht">I = P ÷ U</Fakt>
                <Fakt titel="U gesucht">U = P ÷ I</Fakt>
              </Fakten>
              <Raten
                frage="Ein Drucker nimmt an 230 V eine Leistung von 460 W auf. Welcher Strom fließt?"
                optionen={['2 A', '0,5 A', '105.800 A', '690 A']}
                richtig="2 A"
                hinweis={(v) => (v === '0,5 A' ? 'Andersherum: P ÷ U, nicht U ÷ P.' : 'I = P ÷ U.')}
              >
                <Formel>I = 460 W ÷ 230 V = 2 A</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Ein Netzteil auswählen',
          inhalt: (
            <>
              <Absatz>
                Ein PC-Netzteil muss die höchste Leistungsaufnahme aller Komponenten zusammen liefern können – plus eine <strong>Reserve</strong> für Lastspitzen und Alterung. Der
                Weg:
              </Absatz>
              <Rechenweg
                zeilen={[
                  { text: 'Summe: 105 + 220 + 40 + 10 + 6 + 15 (CPU, Grafik, Board, RAM, SSD, Lüfter)', wert: '396 W' },
                  { text: 'Zuschlag 20 %: 396 W · 1,2', wert: '475,2 W' },
                  { text: 'Kleinstes Netzteil ab 475,2 W (400 / 450 / 500 / 550 W)', wert: '500 W', ton: 'gut' },
                ]}
              />
              <Hinweis icon="lightbulb">20 % Zuschlag heißt · 1,2 – nicht + 20. Und beim Netzteil wird immer aufgerundet.</Hinweis>
              <Raten
                frage="Der Bedarf mit Zuschlag beträgt 410 W. Zur Wahl stehen 400, 450 und 500 W. Welches Netzteil?"
                optionen={['400 W', '450 W', '500 W']}
                richtig="450 W"
                hinweis={(v) => (v === '400 W' ? 'Zu klein – es muss mindestens 410 W liefern.' : 'Es geht auch kleiner – gesucht ist das kleinste passende.')}
              >
                <Absatz>450 W ist das kleinste Netzteil, das mindestens 410 W liefert.</Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Der Wirkungsgrad',
          inhalt: (
            <>
              <Absatz>
                Kein Netzteil arbeitet verlustfrei: Ein Teil der Leistung wird zu Wärme. Der <strong>Wirkungsgrad η</strong> (eta) gibt an, welcher Anteil der aufgenommenen
                Leistung tatsächlich abgegeben wird.
              </Absatz>
              <Formel>η = abgegebene Leistung ÷ aufgenommene Leistung</Formel>
              <Absatz>Umgestellt nach der Leistung, die das Netzteil aus der Steckdose zieht:</Absatz>
              <Formel>aufgenommene Leistung = abgegebene Leistung ÷ η</Formel>
              <div class="zl-wirkung" role="img" aria-label="Von 500 W aufgenommener Leistung werden 450 W abgegeben, 50 W werden zu Wärme">
                <span class="zl-wirkung__titel">aufgenommen: 500 W</span>
                <span class="zl-wirkung__balken">
                  <span class="zl-wirkung__ab" style={{ '--anteil': '90%' }}>
                    450 W abgegeben (90 %)
                  </span>
                  <span class="zl-wirkung__verlust" />
                </span>
                <span class="zl-wirkung__legende">
                  <i /> 50 W werden zu Wärme (10 %)
                </span>
              </div>
              <Raten
                frage="Ein Netzteil gibt 450 W ab, η = 90 %. Wie viel nimmt es aus der Steckdose auf?"
                optionen={['405 W', '500 W', '495 W', '450 W']}
                richtig="500 W"
                hinweis={(v) =>
                  v === '405 W'
                    ? 'Aufgenommen ist mehr als abgegeben – also teilen, nicht malnehmen.'
                    : v === '495 W'
                      ? 'Nicht 10 % aufschlagen, sondern durch 0,9 teilen.'
                      : 'abgegeben ÷ η.'
                }
              >
                <Formel>450 W ÷ 0,9 = 500 W</Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const KOMPONENTEN = [
  { name: 'Prozessor', werte: [65, 105, 125] },
  { name: 'Grafikkarte', werte: [0, 120, 220, 285] },
  { name: 'Mainboard', werte: [30, 40, 50] },
  { name: 'Arbeitsspeicher', werte: [8, 16] },
  { name: 'SSD', werte: [6, 8] },
  { name: 'Lüfter und Sonstiges', werte: [10, 15, 20] },
];
const NETZTEILE = [300, 350, 400, 450, 500, 550, 650, 750, 850];

function LeistungAusprobieren() {
  const [wahl, setWahl] = useState([105, 220, 40, 16, 6, 15]);
  const [zuschlag, setZuschlag] = useState(20);
  const [eta, setEta] = useState(90);
  const summe = wahl.reduce((a, b) => a + b, 0);
  const bedarf = summe * (1 + zuschlag / 100);
  const netzteil = NETZTEILE.find((n) => n >= bedarf) ?? null;
  return (
    <Werkbank>
      <p class="lw-aufgabe">Stell einen PC zusammen. Das Werkzeug rechnet den Bedarf, das passende Netzteil und die Aufnahme aus der Steckdose aus.</p>
      <div class="zl-komponenten">
        {KOMPONENTEN.map((k, i) => (
          <Wahl
            key={k.name}
            label={k.name}
            optionen={k.werte.map((w) => ({ wert: w, text: w ? `${w} W` : 'keine' }))}
            wert={wahl[i]}
            onWert={(w) => setWahl(wahl.map((x, j) => (j === i ? w : x)))}
          />
        ))}
      </div>
      <div class="zl-komponenten">
        <Wahl label="Zuschlag" optionen={[10, 20, 25, 30].map((z) => ({ wert: z, text: `${z} %` }))} wert={zuschlag} onWert={setZuschlag} />
        <Wahl label="Wirkungsgrad η" optionen={[80, 85, 90, 92].map((z) => ({ wert: z, text: `${z} %` }))} wert={eta} onWert={setEta} />
      </div>
      <Rechenweg
        zeilen={[
          { text: `Summe: ${wahl.filter(Boolean).join(' + ')}`, wert: `${summe} W` },
          { text: `Mit ${zuschlag} % Zuschlag: ${summe} W · ${tausend(1 + zuschlag / 100)}`, wert: `${rund(bedarf)} W` },
          netzteil
            ? { text: `Kleinstes Netzteil ab ${rund(bedarf)} W`, wert: `${netzteil} W`, ton: 'gut' }
            : { text: 'Kein Netzteil in der Liste reicht', wert: '–', ton: 'fehler' },
          netzteil ? { text: `Aufnahme bei Volllast (${netzteil} W ÷ ${tausend(eta / 100)})`, wert: `${zwei(netzteil / (eta / 100))} W` } : { text: '', wert: '' },
        ].filter((z) => z.text)}
      />
      {netzteil && (
        <Hinweis icon="lightbulb">Bei Volllast werden {zwei(netzteil / (eta / 100) - netzteil)} W zu Wärme. Ein besserer Wirkungsgrad spart Strom und macht den PC leiser.</Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 13 Energie und Stromkosten ----------

function EnergieErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Leistung ist nicht Energie',
          inhalt: (
            <>
              <Absatz>
                Die <strong>Leistung</strong> (Watt) sagt, wie viel ein Gerät <em>gerade</em> braucht – wie die Geschwindigkeit eines Autos. Die <strong>Energie</strong> sagt, wie
                viel über eine Zeit zusammenkommt – wie die gefahrene Strecke. Bezahlt wird beim Strom die Energie.
              </Absatz>
              <Fakten>
                <Fakt titel="Leistung P">in Watt (W) – „wie stark“</Fakt>
                <Fakt titel="Energie W">in Wattstunden (Wh) oder Kilowattstunden (kWh) – „wie viel insgesamt“</Fakt>
              </Fakten>
              <Hinweis>Achtung: Die Energie heißt W (wie „Work“), die Einheit der Leistung ist W (Watt). Aus dem Zusammenhang ist klar, was gemeint ist.</Hinweis>
            </>
          ),
        },
        {
          titel: 'W = P · t',
          inhalt: (
            <>
              <Absatz>
                Energie ist Leistung mal Zeit. Setzt man die Leistung in Watt und die Zeit in <strong>Stunden</strong> ein, kommt Wattstunden heraus. Durch 1.000 geteilt sind es
                Kilowattstunden.
              </Absatz>
              <Formel>60 W · 5 h = 300 Wh = 0,3 kWh</Formel>
              <Raten
                frage="Ein Monitor mit 25 W läuft 30 Minuten. Wie viele Wh?"
                optionen={['750 Wh', '12,5 Wh', '0,0125 Wh', '25 Wh']}
                richtig="12,5 Wh"
                hinweis={(v) => (v === '750 Wh' ? 'Die Zeit muss in Stunden stehen: 30 min = 0,5 h.' : v === '0,0125 Wh' ? 'Das wären kWh.' : '25 W · 0,5 h = ?')}
              >
                <Formel>30 min = 0,5 h → 25 W · 0,5 h = 12,5 Wh</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Kosten',
          inhalt: (
            <>
              <Absatz>Der Stromanbieter rechnet in kWh ab. Die Kosten sind einfach Energie mal Preis:</Absatz>
              <Formel>Kosten = Energie in kWh · Preis je kWh</Formel>
              <Absatz>Bei 0,32 €/kWh kosten die 0,3 kWh von oben 0,3 · 0,32 = 0,096 € – rund 10 Cent.</Absatz>
            </>
          ),
        },
        {
          titel: 'Ein ganzes Jahr',
          inhalt: (
            <>
              <Absatz>
                Für Jahreskosten rechnet man die Betriebsstunden hoch. Ein Server läuft rund um die Uhr: 24 h · 365 Tage = <strong>8.760 h</strong>. Ein Büro-PC eher 8 h an rund
                220 Arbeitstagen.
              </Absatz>
              <Rechenweg
                titel="Server mit 150 W, Strompreis 0,32 €/kWh"
                zeilen={[
                  { text: 'Stunden: 24 h · 365', wert: '8.760 h' },
                  { text: 'Energie: 150 W · 8.760 h', wert: '1.314.000 Wh' },
                  { text: 'in kWh: ÷ 1.000', wert: '1.314 kWh' },
                  { text: 'Kosten: 1.314 kWh · 0,32 €/kWh', wert: '420,48 €', ton: 'gut' },
                ]}
              />
              <Raten
                frage="Ein Büro-PC mit 100 W läuft 8 h an 220 Tagen. Wie viele kWh im Jahr?"
                optionen={['176 kWh', '176.000 kWh', '1.760 kWh', '17,6 kWh']}
                richtig="176 kWh"
                hinweis={(v) => (v === '176.000 kWh' ? 'Das sind Wh – noch ÷ 1.000.' : '100 W · 8 h · 220 = ? Wh, dann ÷ 1.000.')}
              >
                <Formel>100 W · 8 h · 220 = 176.000 Wh = 176 kWh</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Ersparnis berechnen',
          inhalt: (
            <>
              <Absatz>
                Lohnt sich ein sparsameres Gerät? Man rechnet für beide die Kosten aus – oder gleich mit der <strong>Differenz der Leistung</strong>: Ein neuer Monitor braucht 20 W
                statt 45 W, läuft 2.000 h im Jahr, Strom kostet 0,30 €/kWh.
              </Absatz>
              <Formel>(45 W − 20 W) · 2.000 h = 50.000 Wh = 50 kWh · 0,30 € = 15,00 € im Jahr</Formel>
            </>
          ),
        },
      ]}
    />
  );
}

const PROFILE = [
  { wert: 'server', text: 'Server 24/7', p: 150, h: 24, t: 365 },
  { wert: 'buero', text: 'Büro-PC', p: 100, h: 8, t: 220 },
  { wert: 'monitor', text: 'Monitor', p: 25, h: 8, t: 220 },
  { wert: 'router', text: 'Router 24/7', p: 10, h: 24, t: 365 },
];

function EnergieAusprobieren() {
  const [p, setP] = useState(150);
  const [h, setH] = useState(24);
  const [t, setT] = useState(365);
  const [preis, setPreis] = useState(0.32);
  const ok = [p, h, t, preis].every((x) => x !== null && x >= 0);
  const stunden = ok ? h * t : 0;
  const wh = p * stunden;
  const kwh = wh / 1000;
  return (
    <Werkbank
      leiste={
        <>
          <ZahlFeld label="Leistung" wert={p ?? ''} onWert={setP} einheit="W" />
          <ZahlFeld label="Stunden je Tag" wert={h ?? ''} onWert={setH} einheit="h" max={24} />
          <ZahlFeld label="Tage im Jahr" wert={t ?? ''} onWert={setT} max={366} />
          <ZahlFeld label="Strompreis" wert={preis ?? ''} onWert={setPreis} einheit="€/kWh" schritt={0.01} />
        </>
      }
    >
      <Beispiele
        liste={PROFILE}
        aktiv={PROFILE.find((x) => x.p === p && x.h === h && x.t === t)?.wert}
        onWahl={(w) => {
          const x = PROFILE.find((y) => y.wert === w);
          setP(x.p);
          setH(x.h);
          setT(x.t);
        }}
      />
      {ok && (
        <Rechenweg
          zeilen={[
            { text: `Betriebsstunden: ${tausend(h)} h · ${tausend(t)}`, wert: `${tausend(stunden)} h` },
            { text: `Energie: ${tausend(p)} W · ${tausend(stunden)} h`, wert: `${tausend(wh)} Wh` },
            { text: 'in kWh: ÷ 1.000', wert: `${rund(kwh)} kWh` },
            { text: `Kosten: ${rund(kwh)} kWh · ${zwei(preis)} €/kWh`, wert: `${zwei(kwh * preis)} €`, ton: 'gut' },
          ]}
        />
      )}
    </Werkbank>
  );
}

export const STROM = {
  leistung: { Erklaerung: LeistungErklaerung, Ausprobieren: LeistungAusprobieren },
  energie: { Erklaerung: EnergieErklaerung, Ausprobieren: EnergieAusprobieren },
};
