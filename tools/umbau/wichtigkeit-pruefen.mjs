// Prüft die Wichtigkeit je Stichpunkt (src/daten/wichtigkeit.js) und schreibt den Bericht.
//
// Aufruf:  node tools/umbau/wichtigkeit-pruefen.mjs        (npm run umbau:wichtigkeit)
// Liest:   umbau/zuordnung/wichtigkeit.json, umbau/lernplan/<raum>/*.json, umbau/zuordnung/<raum>/*.json,
//          dazu die App-Daten (tools/vorschau-ap1.mjs)
// Schreibt: umbau/berichte/wichtigkeit-bericht.md
//
// 1. Zweitrechnung: Stufe, Trefferzahl und Prüfungszahl je Stichpunkt unabhängig von der App direkt aus der geprüften
//    Zuordnung umbau/zuordnung/wichtigkeit.json (sonst aus den Lernplänen; Teilaufgaben → Prüfung, Gewicht aus
//    RAEUME_VORSCHAU.ersteAktuelle). Abweichung → Abbruch.
// 2. Zuordnung: Jede Teilaufgabe hat Bausteine oder eine Begründung „ausserhalb“ (sonst Abbruch); gemeldet wird,
//    welche zugeordneten Teilaufgaben an keinem Stichpunkt hängen.
// 3. Wackeltest: je eine Prüfung weglassen – wie viele Stichpunkte wechseln die Stufe?
// 4. Rückwärtstest (rollierend): Prüfung t aus den Prüfungen davor vorhersagen; AUC, Brier, Log-Loss und Trefferprobe,
//    für drei Gewichte alter Prüfungen (0; 0,6; 1). Nur Bericht – über ein anderes Gewicht entscheidet die Aufnahmeregel
//    in umbau/berichte/wichtigkeit-vorschlag.md (3.6).
// 5. Abdeckungskurve: Wie viel einer zurückgehaltenen Prüfung ist nach k gelernten Stichpunkten abgedeckt –
//    Reihenfolge nur nach Quote, mit Fundament (LAMBDA), nach Katalog? Zeigt, was „Grundlagen zuerst“ kostet.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../daten.mjs';
import { vorschauAlle, RAEUME_VORSCHAU, ladeLernplanAp1 } from '../vorschau-ap1.mjs';
import { baueIndex } from '../../src/daten/index.js';
import { STUFEN, stufeFuer, terminVergleich, terminName, LAMBDA, wichtigkeitText } from '../../src/daten/wichtigkeit.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const index = baueIndex(vorschauAlle(ladeDaten(wurzel), wurzel));
const RAEUME = ['AP1', 'PB1', 'PB2', 'WISO'];
const ALT = 0.6;
const fehler = [];
const zeilen = [];
const z = (s = '') => zeilen.push(s);
const pz = (x) => `${Math.round(x * 100)} %`;
const k2 = (x) => (Number.isFinite(x) ? x.toFixed(2).replace('.', ',') : '–');
const k3 = (x) => (Number.isFinite(x) ? x.toFixed(3).replace('.', ',') : '–');

// ---------- Daten je Raum direkt aus den Lernplänen ----------
// Quelle der Belege: die geprüfte Zuordnung (umbau/zuordnung/wichtigkeit.json, P73), sonst das Feld teilaufgaben des Lernplans
const geprueftDatei = path.join(wurzel, 'umbau', 'zuordnung', 'wichtigkeit.json');
const geprueft = fs.existsSync(geprueftDatei) ? JSON.parse(fs.readFileSync(geprueftDatei, 'utf8')) : null;
function raumDaten(r) {
  const cfg = RAEUME_VORSCHAU[r];
  const plaene = ladeLernplanAp1(wurzel, cfg);
  const sps = [];
  for (const p of plaene)
    for (const t of p.themenbloecke)
      for (const s of t.stichpunkte) {
        const ta = geprueft?.[r] ? Object.values(geprueft[r][s.id] ?? {}).flat() : (s.teilaufgaben ?? []);
        const termine = [...new Set(ta.map((x) => x.split('-')[0]))];
        // In der geprüften Datei muss jede Teilaufgabe zu der Prüfung gehören, unter der sie steht
        for (const [pr, tas] of Object.entries(geprueft?.[r]?.[s.id] ?? {})) for (const x of tas) if (!x.startsWith(`${pr}-`)) fehler.push(`${s.id}: ${x} steht unter ${pr}`);
        sps.push({ id: s.id, titel: s.titel, ordner: p.oberblock.id, ta, termine });
      }
  if (geprueft?.[r]) {
    const ids = new Set(sps.map((s) => s.id));
    for (const id of Object.keys(geprueft[r])) if (!ids.has(id)) fehler.push(`${r}: wichtigkeit.json nennt unbekannten Stichpunkt ${id}`);
  }
  const gewicht = (p, wAlt = ALT) => (p >= cfg.ersteAktuelle ? 1 : wAlt);
  const termine = [...new Set(sps.flatMap((s) => s.termine))].sort(terminVergleich);
  return { r, cfg, sps, termine, gewicht };
}
const daten = Object.fromEntries(RAEUME.map((r) => [r, raumDaten(r)]));

// Quote je Stichpunkt aus einer Auswahl von Prüfungen
function quoten(d, auswahl, wAlt = ALT) {
  const summe = auswahl.reduce((a, p) => a + d.gewicht(p, wAlt), 0);
  const m = new Map();
  for (const s of d.sps) {
    const t = s.termine.filter((p) => auswahl.includes(p)).reduce((a, p) => a + d.gewicht(p, wAlt), 0);
    m.set(s.id, { treffer: t, summe, quote: summe ? t / summe : 0, belegt: s.termine.some((p) => auswahl.includes(p)) });
  }
  return m;
}
const stufeAus = (q) => stufeFuer(q.quote, q.belegt);

// ---------- 1. Zweitrechnung ----------
for (const r of RAEUME) {
  const d = daten[r];
  const q = quoten(d, d.termine);
  const app = index.raeume.get(r);
  if (app.wichtig.n !== d.termine.length) fehler.push(`${r}: App zählt ${app.wichtig.n} Prüfungen, Zweitrechnung ${d.termine.length}`);
  for (const s of d.sps) {
    const a = index.sp.get(s.id)?.wichtig;
    if (!a) {
      fehler.push(`${s.id}: fehlt in der App`);
      continue;
    }
    const st = stufeAus(q.get(s.id));
    if (a.stufe !== st || a.x !== s.termine.length || Math.abs(a.quote - q.get(s.id).quote) > 1e-9) fehler.push(`${s.id}: App Stufe ${a.stufe}, ${a.x} Prüfungen – Zweitrechnung Stufe ${st}, ${s.termine.length} Prüfungen`);
  }
}

// ---------- 2. Zuordnung ----------
const zuordnung = {};
for (const r of RAEUME) {
  const dir = path.join(wurzel, 'umbau', 'zuordnung', RAEUME_VORSCHAU[r].dir);
  const tas = new Map();
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) for (const [id, t] of Object.entries(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).teilaufgaben)) tas.set(id, t);
  const anSp = new Set(daten[r].sps.flatMap((s) => s.ta));
  for (const id of anSp) if (!tas.has(id)) fehler.push(`${r}: Beleg ${id} ist keine Teilaufgabe der Zuordnung`);
  for (const id of anSp) if (tas.get(id) && !tas.get(id).bausteine?.length) fehler.push(`${r}: Beleg ${id} ist „ausserhalb“ (${tas.get(id).ausserhalb})`);
  const ohneBegruendung = [...tas].filter(([, t]) => !t.bausteine?.length && !t.ausserhalb).map(([id]) => id);
  for (const id of ohneBegruendung) fehler.push(`${r}: Teilaufgabe ${id} hat weder Bausteine noch eine Begründung „ausserhalb“`);
  const zugeordnet = [...tas].filter(([, t]) => t.bausteine?.length).map(([id]) => id);
  zuordnung[r] = {
    gesamt: tas.size,
    zugeordnet: zugeordnet.length,
    ausserhalb: [...tas.values()].filter((t) => !t.bausteine?.length && t.ausserhalb).length,
    ohneSp: zugeordnet.filter((id) => !anSp.has(id)),
    unbekannt: [...anSp].filter((id) => !tas.has(id)),
  };
}

// ---------- 3. Wackeltest ----------
const wackel = {};
for (const r of RAEUME) {
  const d = daten[r];
  const basis = quoten(d, d.termine);
  const halten = new Map(d.sps.map((s) => [s.id, 0]));
  let wechselSumme = 0;
  let weit = new Set();
  for (const ohne of d.termine) {
    const q = quoten(
      d,
      d.termine.filter((p) => p !== ohne),
    );
    let wechsel = 0;
    for (const s of d.sps) {
      const a = stufeAus(basis.get(s.id));
      const b = stufeAus(q.get(s.id));
      if (a === b) halten.set(s.id, halten.get(s.id) + 1);
      else wechsel++;
      if (Math.abs(a - b) > 1) weit.add(s.id);
    }
    wechselSumme += wechsel / d.sps.length;
  }
  wackel[r] = {
    jeLauf: wechselSumme / d.termine.length,
    instabil: [...halten.values()].filter((h) => h / d.termine.length < 0.8).length / d.sps.length,
    weit: weit.size / d.sps.length,
  };
}

// ---------- 4. Rückwärtstest (rollierend) ----------
function auc(werte, pos) {
  let n = 0;
  let g = 0;
  for (let i = 0; i < werte.length; i++)
    if (pos[i])
      for (let j = 0; j < werte.length; j++)
        if (!pos[j]) {
          n++;
          g += werte[i] > werte[j] ? 1 : werte[i] === werte[j] ? 0.5 : 0;
        }
  return n ? g / n : NaN;
}
const mittel = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const rueck = {};
for (const r of RAEUME) {
  const d = daten[r];
  rueck[r] = {};
  for (const wAlt of [0, ALT, 1]) {
    const laeufe = [];
    let hoch = 0;
    let hochDran = 0;
    for (let i = 3; i < d.termine.length; i++) {
      const vorher = d.termine.slice(0, i);
      const t = d.termine[i];
      const q = quoten(d, vorher, wAlt);
      if (!q.values().next().value?.summe) continue;
      // Vorhersage: Erwartungswert mit Jeffreys-Prior, damit nichts 0 oder 1 ist (Log-Loss)
      const p = d.sps.map((s) => {
        const x = q.get(s.id);
        return (x.treffer + 0.5) / (x.summe + 1);
      });
      const dran = d.sps.map((s) => s.termine.includes(t));
      d.sps.forEach((s, j) => {
        if (q.get(s.id).quote >= STUFEN[0].ab) {
          hoch++;
          if (dran[j]) hochDran++;
        }
      });
      laeufe.push({
        t,
        aktuell: t >= d.cfg.ersteAktuelle,
        auc: auc(p, dran),
        brier: mittel(p.map((x, j) => (x - (dran[j] ? 1 : 0)) ** 2)),
        logloss: mittel(p.map((x, j) => -Math.log(dran[j] ? x : 1 - x))),
      });
    }
    rueck[r][wAlt] = {
      laeufe,
      auc: mittel(laeufe.map((l) => l.auc)),
      aucAktuell: mittel(laeufe.filter((l) => l.aktuell).map((l) => l.auc)),
      brier: mittel(laeufe.map((l) => l.brier)),
      logloss: mittel(laeufe.map((l) => l.logloss)),
      treffer: hoch ? hochDran / hoch : NaN,
      hoch,
    };
  }
}

// ---------- 5. Abdeckungskurve ----------
// Für jede Prüfung nach aktuellem Katalog: Quoten aus allen anderen Prüfungen, Stichpunkte ordnen, dann zählen,
// welcher Anteil der Teilaufgaben dieser Prüfung nach k Stichpunkten abgedeckt ist (Teilaufgabe mit m Stichpunkten: je 1/m).
const abdeckung = {};
const grundlagen = (id) => index.sp.get(id)?.grundlageFuer ?? [];
for (const r of RAEUME) {
  const d = daten[r];
  const teiler = new Map();
  for (const s of d.sps) for (const ta of s.ta) teiler.set(ta, (teiler.get(ta) ?? 0) + 1);
  const ergebnis = { quote: [], fundament: [], katalog: [], zufall: [] };
  for (const t of d.termine.filter((p) => p >= d.cfg.ersteAktuelle)) {
    const q = quoten(
      d,
      d.termine.filter((p) => p !== t),
    );
    const quoteVon = (id) => q.get(id)?.quote ?? index.sp.get(id)?.wichtig.quote ?? 0; // andere Räume: App-Quote
    const tasT = new Set(d.sps.flatMap((s) => s.ta.filter((ta) => ta.startsWith(`${t}-`))));
    if (!tasT.size) continue;
    const kurve = (reihe) => {
      let gedeckt = 0;
      const punkte = reihe.map((s) => {
        gedeckt += s.ta.filter((ta) => tasT.has(ta)).reduce((a, ta) => a + 1 / teiler.get(ta), 0);
        return gedeckt / tasT.size;
      });
      return mittel(punkte);
    };
    const wert = (s, lambda) => q.get(s.id).quote + lambda * grundlagen(s.id).reduce((a, id) => a + quoteVon(id), 0);
    const nach = (lambda) => [...d.sps].sort((a, b) => wert(b, lambda) - wert(a, lambda));
    ergebnis.quote.push(kurve(nach(0)));
    ergebnis.fundament.push(kurve(nach(LAMBDA)));
    ergebnis.katalog.push(kurve(d.sps));
    // Zufall: Erwartungswert = halbe Fläche bei gleichmäßiger Verteilung (Mittel über viele Mischungen)
    let z = 0;
    let saat = 7;
    const rnd = () => ((saat = (saat * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 200; i++) z += kurve([...d.sps].map((s) => [rnd(), s]).sort((a, b) => a[0] - b[0]).map((x) => x[1]));
    ergebnis.zufall.push(z / 200);
  }
  abdeckung[r] = Object.fromEntries(Object.entries(ergebnis).map(([k, v]) => [k, mittel(v)]));
  abdeckung[r].kosten = abdeckung[r].quote ? (abdeckung[r].quote - abdeckung[r].fundament) / abdeckung[r].quote : NaN;
  abdeckung[r].pruefungen = ergebnis.quote.length;
}

// ---------- Bericht ----------
z('# Wichtigkeit – Prüfbericht');
z();
z(`Erzeugt mit \`npm run umbau:wichtigkeit\` (tools/umbau/wichtigkeit-pruefen.mjs). Regeln: \`src/daten/wichtigkeit.js\`, Begründung: \`wichtigkeit-vorschlag.md\`.`);
z(`Grundlage: die Zuordnungen in \`umbau/zuordnung/\` und \`umbau/lernplan/\` im aktuellen Stand. Nicht von Hand ändern – neu erzeugen.`);
z();
z(`**Ergebnis der Zweitrechnung:** ${fehler.length ? `${fehler.length} Abweichungen (siehe unten)` : 'App und Zweitrechnung stimmen für alle Stichpunkte überein.'}`);
z();
z(
  geprueft
    ? `**Quelle der Belege:** geprüfte Zuordnung \`umbau/zuordnung/wichtigkeit.json\` (P73, Stand ${geprueft.meta?.stand ?? '–'}): Paare, die die Zuordnung beim Bau (A) und eine blinde Zweitzuordnung (B) beide nennen, dazu die vom Schiedsrichter bestätigten.`
    : '**Quelle der Belege:** Feld `teilaufgaben` der Lernpläne (noch keine geprüfte Zuordnung).',
);
z();
if (geprueft?.meta?.zaehlung) {
  z('| Raum | Teilaufgaben | Paare A | Paare B | einig | strittig | davon bestätigt | verworfen | gezählt |');
  z('|---|---|---|---|---|---|---|---|---|');
  for (const r of RAEUME) {
    const x = geprueft.meta.zaehlung[r];
    if (x) z(`| ${r} | ${x.teilaufgaben} | ${x.paare_A} | ${x.paare_B} | ${x.einig} | ${x.strittig} | ${x.bestaetigt} | ${x.verworfen} | ${x.ergebnis} |`);
  }
  z();
}
z('## Überblick je Raum');
z();
z('| Raum | Prüfungen | davon aktueller Katalog | Stichpunkte | ' + STUFEN.map((s) => s.kurz).join(' | ') + ' |');
z('|---|---|---|---|' + STUFEN.map(() => '---').join('|') + '|');
for (const r of RAEUME) {
  const d = daten[r];
  const c = STUFEN.map((s) => d.sps.filter((x) => index.sp.get(x.id).wichtig.stufe === s.nr).length);
  z(`| ${r} | ${d.termine.length} | ${d.termine.filter((p) => p >= d.cfg.ersteAktuelle).length} | ${d.sps.length} | ${c.join(' | ')} |`);
}
z();
z('## Zuordnung');
z();
z('| Raum | Teilaufgaben | zugeordnet | begründet außerhalb | zugeordnet, aber an keinem Stichpunkt | an Stichpunkten, aber nicht in der Zuordnung |');
z('|---|---|---|---|---|---|');
for (const r of RAEUME) {
  const x = zuordnung[r];
  z(`| ${r} | ${x.gesamt} | ${x.zugeordnet} | ${x.ausserhalb} | ${x.ohneSp.length}${x.ohneSp.length ? ` (${x.ohneSp.slice(0, 8).join(', ')}${x.ohneSp.length > 8 ? ', …' : ''})` : ''} | ${x.unbekannt.length} |`);
}
z();
z('Teilaufgaben „an keinem Stichpunkt“ gehören zu Bausteinen, deren Stichpunkt in einem anderen Raum wohnt (importierte Bausteine) oder die nur Grenzen/Kür belegen. Sie zählen hier nicht für die Wichtigkeit.');
z();
z('## Wackeltest (je eine Prüfung weglassen)');
z();
z('| Raum | Wechsel je Lauf (Mittel) | Stichpunkte, die in weniger als 80 % der Läufe ihre Stufe halten | Sprung über mehr als 1 Stufe |');
z('|---|---|---|---|');
for (const r of RAEUME) z(`| ${r} | ${pz(wackel[r].jeLauf)} | ${pz(wackel[r].instabil)} | ${pz(wackel[r].weit)} |`);
z();
z('## Rückwärtstest (rollierend: Prüfung t aus allen Prüfungen davor, ab der 4.)');
z();
z(`AUC: 0,50 = Zufall, 1,00 = perfekt; Standardfehler je Prüfung etwa ±0,05. Brier und Log-Loss: kleiner ist besser. Treffer: Anteil der Stichpunkte mit Quote ab ${pz(STUFEN[0].ab)}, die in der nächsten Prüfung wirklich dran waren.`);
z();
z('| Raum | Gewicht alt | Läufe | AUC | AUC nur Prüfungen nach aktuellem Katalog | Brier | Log-Loss | Treffer „Sehr oft“ |');
z('|---|---|---|---|---|---|---|---|');
for (const r of RAEUME)
  for (const wAlt of [0, ALT, 1]) {
    const x = rueck[r][wAlt];
    z(`| ${r} | ${k2(wAlt)} | ${x.laeufe.length} | ${k2(x.auc)} | ${k2(x.aucAktuell)} | ${k3(x.brier)} | ${k3(x.logloss)} | ${Number.isFinite(x.treffer) ? `${pz(x.treffer)} (${x.hoch})` : '–'} |`);
  }
z();
z('Gewicht alt 0 lässt sich erst bewerten, wenn vor der Testprüfung schon eine Prüfung nach aktuellem Katalog liegt – deshalb weniger Läufe; die Zeilen sind nicht direkt vergleichbar.');
z('Treffer „Sehr oft“ ist die ehrliche Probe auf die Namen: Die Stufen beschreiben, was bisher geprüft wurde. Wie oft ein „sehr oft geprüfter“ Stichpunkt in der nächsten Prüfung wirklich dran ist, steht hier – in AP1 deutlich seltener als der Name vermuten lässt.');
z();
z('Gilt nach der Aufnahmeregel (Vorschlag 3.6): Ein anderes Gewicht für alte Prüfungen kommt nur, wenn es den Log-Loss in mindestens 3 von 4 Räumen senkt und das Bootstrap-Intervall die 0 nicht enthält. Diese Tabelle ist die Vorstufe dazu.');
z();
z(`## Abdeckungskurve (Fläche: mittlerer abgedeckter Anteil einer Prüfung nach aktuellem Katalog, wenn man die Stichpunkte der Reihe nach lernt)`);
z();
z(`| Raum | Prüfungen | nach Quote | mit Fundament (λ = ${k2(LAMBDA)}) | Katalog-Reihenfolge | Zufall | Kosten „Grundlagen zuerst“ |`);
z('|---|---|---|---|---|---|---|');
for (const r of RAEUME) {
  const x = abdeckung[r];
  z(`| ${r} | ${x.pruefungen} | ${k3(x.quote)} | ${k3(x.fundament)} | ${k3(x.katalog)} | ${k3(x.zufall)} | ${Number.isFinite(x.kosten) ? pz(x.kosten) : '–'} |`);
}
z();
z('Kosten = wie viel Fläche die Reihenfolge mit Fundament gegenüber „nur nach Quote“ verliert (negativ: sie gewinnt). Grenze laut Vorschlag: höchstens 5 %.');
z();
if (fehler.length) {
  z('## Abweichungen');
  z();
  for (const f of fehler) z(`- ${f}`);
  z();
}
z('## Stichpunkte');
for (const r of RAEUME) {
  const d = daten[r];
  z();
  z(`### ${r} (${d.termine.length} Prüfungen: ${terminName(d.termine[0])} bis ${terminName(d.termine.at(-1))})`);
  z();
  z('| Stichpunkt | Titel | Stufe | Prüfungen | Quote | plausibel | Termine | Grundlage für |');
  z('|---|---|---|---|---|---|---|---|');
  const liste = [...d.sps].sort((a, b) => index.sp.get(b.id).wichtig.quote - index.sp.get(a.id).wichtig.quote || a.id.localeCompare(b.id, 'de', { numeric: true }));
  for (const s of liste) {
    const a = index.sp.get(s.id);
    const w = a.wichtig;
    z(`| ${s.id} | ${s.titel.replace(/\|/g, '/')} | ${STUFEN[w.stufe - 1].kurz} | ${w.x} von ${w.n} | ${pz(w.quote)} | ${w.von}–${w.bis} | ${w.termine.join(', ') || '–'} | ${a.grundlageFuer.length || ''} |`);
  }
}
z();

const ziel = path.join(wurzel, 'umbau', 'berichte', 'wichtigkeit-bericht.md');
fs.writeFileSync(ziel, zeilen.join('\n'));

// Kurzfassung auf der Konsole
console.log('Wichtigkeit geprüft:');
for (const r of RAEUME) {
  const x = rueck[r][ALT];
  console.log(
    `  ${r.padEnd(5)} Prüfungen ${String(daten[r].termine.length).padStart(2)} · Wackel ${pz(wackel[r].jeLauf)} je Lauf · Rückwärts AUC ${k2(x.auc)} (${x.laeufe.length} Läufe) · Abdeckung Kosten Fundament ${Number.isFinite(abdeckung[r].kosten) ? pz(abdeckung[r].kosten) : '–'} · Zuordnung ohne Stichpunkt ${zuordnung[r].ohneSp.length}`,
  );
}
console.log(`Bericht: ${path.relative(wurzel, ziel)}`);
const beispiel = [...index.sp.values()].find((s) => s.raum === 'AP1' && s.titel.startsWith('Peripheriegeräte'));
if (beispiel) console.log(`Beispiel: ${beispiel.titel} – ${wichtigkeitText(beispiel.wichtig)}`);
if (fehler.length) {
  console.error(`\n${fehler.length} Fehler:`);
  for (const f of fehler.slice(0, 30)) console.error(`  ${f}`);
  process.exit(1);
}
