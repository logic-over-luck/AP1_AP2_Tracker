// Wichtigkeit eines Stichpunkts: wie oft er in den ausgewerteten Prüfungen seines Raums vorkam.
// Vorschlag und Begründung: umbau/berichte/wichtigkeit-vorschlag.md (Fassung 2). Prüfskript:
// tools/umbau/wichtigkeit-pruefen.mjs. Rein, ohne Browser-Abhängigkeit (App, Prüfskript und Tests rechnen gleich).
//
// – Quote: Summe der Gewichte der Prüfungen, in denen der Stichpunkt vorkam, geteilt durch die Summe der Gewichte
//   aller Prüfungen des Raums. Jede Prüfung zählt je Stichpunkt höchstens einmal; Gewicht aus den Belegen
//   (aktueller Katalog 1, alter 0,6). Keine Glättung: Sie zieht alle Stichpunkte eines Raums gleich stark zum
//   Themenbereich, ihr Nutzen ist nicht belegt und sie hebt „bisher nicht geprüft“ auf.
// – Hauptzahl für Menschen: „in x von N Prüfungen“ (ungewichtet), dazu der plausible Bereich (80-%-Intervall der
//   Beta-Verteilung mit Jeffreys-Prior, umgerechnet auf N). Mit 8–11 Prüfungen sind die mittleren Stufen nicht scharf
//   trennbar; der Bereich zeigt das ehrlich, statt einzelne Stichpunkte als „unsicher“ zu markieren.
// – Das Fundament (Stichpunkte, die auf diesem aufbauen) zählt nicht zur Stufe, nur zur Lernreihenfolge.

export const STUFEN = [
  { nr: 1, name: 'Sehr oft geprüft', kurz: 'Sehr oft', ab: 0.4, text: 'In mehr als jeder dritten Prüfung dran.' },
  { nr: 2, name: 'Oft geprüft', kurz: 'Oft', ab: 0.25, text: 'In etwa jeder vierten Prüfung dran.' },
  { nr: 3, name: 'Manchmal geprüft', kurz: 'Manchmal', ab: 0.12, text: 'In etwa jeder achten Prüfung dran.' },
  { nr: 4, name: 'Selten geprüft', kurz: 'Selten', ab: 0, text: 'Ein- oder zweimal dran, meist nach altem Katalog.' },
  { nr: 5, name: 'Bisher nicht geprüft', kurz: 'Bisher nicht', ab: null, text: 'Steht im Katalog, kam in den ausgewerteten Prüfungen aber nicht vor. Kann trotzdem drankommen.' },
];
export const NICHT_GEPRUEFT = 5;
// Stufen 1 und 2 gelten als „oft geprüft“ (Filter im Lernplan)
export const OFT_BIS = 2;
// Gewicht des Fundaments in der Lernreihenfolge: Reihenfolge-Wert = Quote + LAMBDA · Summe der Quoten der offenen
// Stichpunkte, die darauf aufbauen. Eine Setzung (aus Prüfungsdaten nicht schätzbar); das Prüfskript zeigt, wie viel
// Prüfungsabdeckung sie kostet.
export const LAMBDA = 0.5;
// Plausibler Bereich: 80-%-Intervall
export const BEREICH = [0.1, 0.9];

export const stufeFuer = (quote, belegt) => (belegt ? STUFEN.find((s) => s.ab !== null && (s.ab === 0 ? quote > 0 : quote >= s.ab)).nr : NICHT_GEPRUEFT);
export const stufe = (nr) => STUFEN[nr - 1];

// Prüfungstermine: 2026H → Herbst 2026, 2025S → Sommer 2025. Reihenfolge nach Jahr, dann Frühjahr/Sommer vor Herbst/Winter.
const JAHRESZEIT = { F: ['Frühjahr', 0], S: ['Sommer', 0], H: ['Herbst', 1], W: ['Winter', 1] };
export function terminName(id) {
  const m = String(id).match(/^(\d{4})([FSHW])$/);
  return m ? `${JAHRESZEIT[m[2]][0]} ${m[1]}` : String(id);
}
const terminSchluessel = (id) => {
  const m = String(id).match(/^(\d{4})([FSHW])$/);
  return m ? Number(m[1]) * 2 + JAHRESZEIT[m[2]][1] : Infinity;
};
export const terminVergleich = (a, b) => terminSchluessel(a) - terminSchluessel(b) || String(a).localeCompare(String(b));

// Quantile der Beta-Verteilung, numerisch (Mittelpunktregel). Genau genug für ganze Prüfungen.
export function betaQuantile(a, b, ps, schritte = 2000) {
  const dichte = [];
  let summe = 0;
  for (let i = 0; i < schritte; i++) {
    const x = (i + 0.5) / schritte;
    const d = Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x));
    summe += d;
    dichte.push(summe);
  }
  return ps.map((p) => (dichte.findIndex((c) => c >= p * summe) + 0.5) / schritte);
}

// Plausibler Bereich in ganzen Prüfungen: treffer und summe gewichtet, anzahl = Prüfungen des Raums (ungewichtet)
export function plausiblerBereich(treffer, summe, anzahl) {
  if (!summe) return { von: 0, bis: 0 };
  const [lo, hi] = betaQuantile(treffer + 0.5, summe - treffer + 0.5, BEREICH);
  return { von: Math.round(lo * anzahl), bis: Math.round(hi * anzahl) };
}

// Wichtigkeit aller Stichpunkte eines Raums. pruef je Stichpunkt: [[Prüfung, Gewicht], …]
export function wichtigkeitRaum(spListe) {
  const pruefungen = new Map();
  for (const s of spListe) for (const [p, g] of s.pruef ?? []) pruefungen.set(p, Math.max(pruefungen.get(p) ?? 0, g));
  const summe = [...pruefungen.values()].reduce((a, g) => a + g, 0);
  const n = pruefungen.size;
  const je = new Map();
  for (const s of spListe) {
    const eigene = new Map();
    for (const [p, g] of s.pruef ?? []) eigene.set(p, Math.max(eigene.get(p) ?? 0, g));
    const treffer = [...eigene.values()].reduce((a, g) => a + g, 0);
    const quote = summe ? treffer / summe : 0;
    const termine = [...eigene.keys()].sort(terminVergleich);
    je.set(s.id, {
      x: eigene.size,
      // Prüfungen, die nur über die Themenliste des Podcasts belegt sind (Gewicht unter 0,6; UMBAU.md P74)
      nurStichwort: [...eigene.values()].filter((g) => g < 0.6).length,
      n,
      quote,
      stufe: stufeFuer(quote, eigene.size > 0),
      termine,
      zuletzt: termine.at(-1) ?? null,
      ...plausiblerBereich(treffer, summe, n),
    });
  }
  return {
    raum: {
      n,
      aktuell: [...pruefungen.values()].filter((g) => g >= 1).length,
      // Prüfungen ohne Abschrift, nur aus der Themenliste des Podcasts
      nurStichwort: [...pruefungen.entries()].filter(([, g]) => g < 0.6).map(([p]) => p).sort(terminVergleich),
      summe,
      termine: [...pruefungen.keys()].sort(terminVergleich),
    },
    je,
  };
}

// Zusammenfassung einer Liste von Stichpunkten (Block, Themenbereich): Anzahl je Stufe, beste Stufe
export function stufenVerteilung(spListe) {
  const anzahl = Array(STUFEN.length + 1).fill(0);
  for (const s of spListe) anzahl[s.wichtig.stufe]++;
  return { anzahl, beste: spListe.length ? Math.min(...spListe.map((s) => s.wichtig.stufe)) : NICHT_GEPRUEFT };
}

// Text für Tooltip und Details: „Oft geprüft · in 4 von 11 Prüfungen, zuletzt Frühjahr 2026 · wahrscheinlich 2 bis 7 von 11“
export function wichtigkeitText(w, { kurz = false } = {}) {
  const teile = [stufe(w.stufe).name];
  if (w.x) teile.push(`in ${w.x} von ${w.n} Prüfungen${w.nurStichwort ? ` (${w.nurStichwort} davon nur laut Themenliste)` : ''}, zuletzt ${terminName(w.zuletzt)}`);
  else if (w.n) teile.push(`in keiner der ${w.n} ausgewerteten Prüfungen`);
  for (const q of w.quer ?? []) teile.push(`auch in ${q.x} von ${q.n} ${q.name}-Prüfungen`);
  if (!kurz && w.n) teile.push(w.von === w.bis ? `wahrscheinlich ${w.von} von ${w.n}` : `wahrscheinlich ${w.von} bis ${w.bis} von ${w.n}`);
  return teile.join(' · ');
}

// Reihenfolge-Wert eines offenen Stichpunkts: eigene Quote plus LAMBDA mal die Quoten der offenen Stichpunkte,
// die auf ihm aufbauen (Fundament). offen(id) sagt, ob ein Stichpunkt noch nicht abgehakt ist.
export function reihenfolgeWert(s, index, offen = () => true) {
  const fundament = (s.grundlageFuer ?? []).filter(offen).reduce((a, id) => a + (index.sp.get(id)?.wichtig.quote ?? 0), 0);
  return s.wichtig.quote + LAMBDA * fundament;
}

// Wert eines Blocks für die Reihenfolge: der beste offene Stichpunkt zählt; bei Gleichstand die Summe der offenen.
export function blockWert(block, index, offen = () => true) {
  const werte = block.sp.filter(offen).map((id) => index.sp.get(id)).filter(Boolean).map((s) => reihenfolgeWert(s, index, offen));
  return { bester: werte.length ? Math.max(...werte) : -1, summe: werte.reduce((a, w) => a + w, 0) };
}
export const blockVergleich = (a, b) => b.bester - a.bester || b.summe - a.summe;
