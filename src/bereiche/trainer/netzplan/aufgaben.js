// Aufgabenerzeuger Netzplan & Projektplanung. Rein, getestet in tests/netzplan.test.mjs.

import { erzeuge, berechne, liesWeg } from './plan.js';

const WERTE = ['faz', 'fez', 'saz', 'sez', 'gp', 'fp'];
const WERT_NAME = { faz: 'FAZ', fez: 'FEZ', saz: 'SAZ', sez: 'SEZ', gp: 'GP', fp: 'FP' };

function wegFeld(plan, imBild = false) {
  const wege = plan.kritisch.map((w) => w.join(''));
  const alleKritisch = [...new Set(plan.kritisch.flat())].sort().join('');
  return {
    id: 'weg',
    label: plan.kritisch.length > 1 ? 'Kritischer Weg (z. B. A-C-F; bei mehreren: A-C-F / A-D-F)' : 'Kritischer Weg (z. B. A-C-F)',
    typ: 'eigen',
    breit: true,
    imBild,
    soll: plan.kritisch.map((w) => w.join('-')).join(' / '),
    // Richtig ist ein vollständiger kritischer Weg, mehrere davon, oder alle kritischen Vorgänge.
    pruefe: (e) => {
      const teile = String(e ?? '')
        .split(/\/|\boder\b|\bund\b|;/i)
        .map((t) => liesWeg(t).join(''))
        .filter(Boolean);
      if (!teile.length) return { ok: false, leer: true };
      if (teile.every((t) => wege.includes(t))) return { ok: true };
      if (teile.length === 1 && [...teile[0]].sort().join('') === alleKritisch && plan.kritisch.length > 1) return { ok: true };
      return { ok: false };
    },
  };
}

function rechenweg(plan) {
  const v = plan.vorgaenge;
  return [
    'Vorwärtsrechnung: FAZ = größter FEZ der Vorgänger (Start: 0), FEZ = FAZ + Dauer',
    ...v.map((x) => `${x.id}: FAZ ${x.vorgaenger.length ? `max(${x.vorgaenger.map((p) => v.find((y) => y.id === p).fez).join(', ')})` : '0'} = ${x.faz}, FEZ ${x.faz} + ${x.dauer} = ${x.fez}`),
    `Projektdauer = FEZ des letzten Vorgangs = **${plan.dauer}**`,
    'Rückwärtsrechnung: SEZ = kleinster SAZ der Nachfolger (Ende: Projektdauer), SAZ = SEZ − Dauer',
    ...[...v].reverse().map((x) => `${x.id}: SEZ ${x.nachfolger.length ? `min(${x.nachfolger.map((n) => v.find((y) => y.id === n).saz).join(', ')})` : plan.dauer} = ${x.sez}, SAZ ${x.sez} − ${x.dauer} = ${x.saz}`),
    'Puffer: GP = SAZ − FAZ, FP = kleinster FAZ der Nachfolger − FEZ',
    ...v.filter((x) => x.gp || x.fp).map((x) => `${x.id}: GP = ${x.saz} − ${x.faz} = ${x.gp}, FP = ${x.fp}`),
    `Kritischer Weg (GP = 0): **${plan.kritisch.map((w) => w.join(' → ')).join(' oder ')}**`,
  ];
}

// Teilweise ausgefüllten Netzplan vervollständigen
export function berechnen(r, raum = 'AP1') {
  const roh = erzeuge(r, raum === 'AP2' ? { min: 7, max: 10, thema: 'sw' } : { min: 6, max: 9, thema: 'it' });
  const plan = berechne(roh.vorgaenge);
  // Welche Knoten sind vorgegeben? Etwa ein Drittel bis die Hälfte, nie alle auf dem kritischen Weg.
  const gegeben = new Set(r.mische(plan.vorgaenge.map((v) => v.id)).slice(0, Math.floor(plan.vorgaenge.length * r.wahl([0.3, 0.4, 0.5]))));
  const felder = [];
  for (const v of plan.vorgaenge) {
    if (gegeben.has(v.id)) continue;
    for (const w of WERTE) felder.push({ id: `${v.id}.${w}`, label: `${v.id} ${WERT_NAME[w]}`, erwartet: v[w], imBild: true });
  }
  felder.push({ id: 'dauer', label: 'Projektdauer', erwartet: plan.dauer, einheit: 'Tage' });
  felder.push(wegFeld(plan));
  return {
    titel: 'Netzplan vervollständigen',
    sp: raum === 'AP2' ? 'AP2-1-1-4' : 'AP1-1-2-2',
    text: 'Vervollständige den Netzplan: Trage für die leeren Knoten FAZ, FEZ, SAZ, SEZ, Gesamtpuffer (GP) und freien Puffer (FP) ein. Gib danach die Projektdauer (in Tagen) und den kritischen Weg an.',
    plan,
    gegeben: [...gegeben],
    tabelle: vorgangsliste(plan),
    felder,
    loesung: rechenweg(plan),
  };
}

export function vorgangsliste(plan) {
  return { kopf: ['Nr.', 'Vorgang', 'Dauer (Tage)', 'Vorgänger'], zeilen: plan.vorgaenge.map((v) => [v.id, v.name, String(v.dauer), v.vorgaenger.join(', ') || '–']), rechtsbuendig: [2] };
}

// Aus einer Textbeschreibung die Vorgänger bestimmen
const VERBINDER = ['Erst wenn', 'Sobald', 'Nachdem'];

export function beschreibung(plan, r) {
  const byId = new Map(plan.vorgaenge.map((v) => [v.id, v]));
  return plan.vorgaenge.map((v) => {
    const name = `„${v.name}" (${v.id}, ${v.dauer} ${v.dauer === 1 ? 'Tag' : 'Tage'})`;
    if (!v.vorgaenger.length) return `Das Projekt beginnt mit ${name}.`;
    const vor = v.vorgaenger.map((p) => `„${byId.get(p).name}"`);
    const liste = vor.length === 1 ? vor[0] : `${vor.slice(0, -1).join(', ')} und ${vor.at(-1)}`;
    const verb = r.wahl(VERBINDER);
    if (verb === 'Nachdem') return `Nachdem ${liste} ${vor.length === 1 ? 'abgeschlossen ist' : 'abgeschlossen sind'}, folgt ${name}.`;
    return `${verb} ${liste} ${vor.length === 1 ? 'fertig ist' : 'fertig sind'}, ${verb === 'Sobald' ? 'kann' : 'kann'} ${name} beginnen.`;
  });
}

function vorgaengerFeld(v) {
  const soll = [...v.vorgaenger].sort().join('');
  return {
    id: `vor.${v.id}`,
    label: `Vorgänger von ${v.id}`,
    typ: 'eigen',
    soll: v.vorgaenger.join(', ') || '–',
    platzhalter: v.vorgaenger.length ? 'z. B. B, C' : '– (keiner)',
    pruefe: (e) => {
      const s = String(e ?? '').trim();
      const ids = liesWeg(s).sort().join('');
      if (!soll) return { ok: s === '' || s === '-' || s === '–' || /^kein/i.test(s) };
      if (!s) return { ok: false, leer: true };
      return { ok: ids === soll };
    },
  };
}

export function aufbauen(r, raum = 'AP1') {
  const roh = erzeuge(r, raum === 'AP2' ? { min: 7, max: 9, thema: 'sw' } : { min: 6, max: 8, thema: 'it' });
  const plan = berechne(roh.vorgaenge);
  const saetze = beschreibung(plan, r);
  return {
    titel: 'Netzplan aus einer Beschreibung',
    sp: raum === 'AP2' ? 'AP2-1-1-4' : 'AP1-1-2-2',
    text: `Lies die Beschreibung und bestimme zu jedem Vorgang die direkten Vorgänger. Berechne dann die Projektdauer und gib den kritischen Weg an. (Skizziere den Netzplan dafür am besten auf Papier.)\n${saetze.map((s) => `- ${s}`).join('\n')}`,
    felder: [...plan.vorgaenge.filter((v) => v.vorgaenger.length).map(vorgaengerFeld), { id: 'dauer', label: 'Projektdauer', erwartet: plan.dauer, einheit: 'Tage' }, wegFeld(plan)],
    plan,
    zeigePlanNachLoesung: true,
    loesung: [`Vorgangsliste: ${plan.vorgaenge.map((v) => `${v.id} ← ${v.vorgaenger.join(',') || '–'}`).join(' · ')}`, ...rechenweg(plan)],
  };
}

// Gantt-Diagramm lesen und eintragen
export function gantt(r) {
  const roh = erzeuge(r, { min: 5, max: 7, thema: 'it' });
  const plan = berechne(roh.vorgaenge);
  const art = r.wahl(['lesen', 'eintragen']);
  const v = r.wahl(plan.vorgaenge.slice(1));
  if (art === 'eintragen') {
    return {
      titel: 'Balken ins Gantt-Diagramm eintragen',
      sp: 'AP1-1-2-1',
      text: `Plane die Vorgänge so früh wie möglich ein (Tag 1 ist der erste Projekttag). In welchen Tagen liegt der Balken von **${v.id} „${v.name}"**? Wie lange dauert das Projekt?`,
      tabelle: vorgangsliste(plan),
      plan,
      gantt: { verdeckt: v.id },
      felder: [
        { id: 'von', label: `${v.id} beginnt an Tag`, erwartet: v.faz + 1 },
        { id: 'bis', label: `${v.id} endet mit Tag`, erwartet: v.fez },
        { id: 'dauer', label: 'Projektdauer', erwartet: plan.dauer, einheit: 'Tage' },
      ],
      loesung: [`${v.id} kann frühestens beginnen, wenn ${v.vorgaenger.join(' und ')} fertig ${v.vorgaenger.length > 1 ? 'sind' : 'ist'}: nach Tag ${v.faz} → Beginn an **Tag ${v.faz + 1}**`, `Dauer ${v.dauer} → letzter Tag: ${v.faz} + ${v.dauer} = **Tag ${v.fez}**`, `Projektende nach **${plan.dauer} Tagen** (Ende des letzten Balkens)`],
    };
  }
  const tag = r.ganz(2, plan.dauer - 1);
  const parallel = plan.vorgaenge.filter((x) => x.faz < tag && x.fez >= tag).map((x) => x.id);
  const meilenstein = plan.vorgaenge.at(-1);
  return {
    titel: 'Gantt-Diagramm lesen',
    sp: 'AP1-1-2-1',
    text: `Lies aus dem Gantt-Diagramm ab (alle Vorgänge frühestmöglich eingeplant): Wie lange dauert das Projekt, welche Vorgänge laufen an **Tag ${tag}**, und an welchem Tag beginnt „${meilenstein.name}"?`,
    plan,
    gantt: {},
    felder: [
      { id: 'dauer', label: 'Projektdauer', erwartet: plan.dauer, einheit: 'Tage' },
      {
        id: 'tag',
        label: `Vorgänge an Tag ${tag} (z. B. B, C)`,
        typ: 'eigen',
        soll: parallel.join(', '),
        pruefe: (e) => {
          const s = liesWeg(e).sort().join('');
          return s ? { ok: s === [...parallel].sort().join('') } : { ok: false, leer: true };
        },
      },
      { id: 'ms', label: `${meilenstein.id} beginnt an Tag`, erwartet: meilenstein.faz + 1 },
    ],
    loesung: [`Das Projekt endet mit dem letzten Balken: **${plan.dauer} Tage**`, `An Tag ${tag} laufen: **${parallel.join(', ')}**`, `${meilenstein.id} beginnt an **Tag ${meilenstein.faz + 1}**`, 'Der Projektstrukturplan zeigt, was zu tun ist; das Gantt-Diagramm zeigt, wann.'],
  };
}

// Projektstrukturplan: Arbeitspakete den Teilaufgaben zuordnen
const PSP = [
  {
    projekt: 'Neuer Schulungsraum',
    teile: {
      Planung: ['Anforderungen der Trainer erfassen', 'Raumplan mit Arbeitsplätzen zeichnen', 'Budget festlegen'],
      Beschaffung: ['Angebote für PCs vergleichen', 'Monitore bestellen', 'Möbel bestellen'],
      Installation: ['Netzwerkdosen setzen', 'PCs aufbauen', 'Betriebssystem verteilen'],
      Abschluss: ['Funktionstest durchführen', 'Abnahmeprotokoll erstellen'],
    },
  },
  {
    projekt: 'Webshop für einen Fahrradhändler',
    teile: {
      Analyse: ['Lastenheft abstimmen', 'Zahlungsarten klären', 'Zielgruppe beschreiben'],
      Entwurf: ['Datenmodell entwerfen', 'Mockups erstellen'],
      Umsetzung: ['Produktkatalog programmieren', 'Warenkorb programmieren', 'Zahlungsanbieter anbinden'],
      Einführung: ['Shop testen', 'Mitarbeiter schulen', 'Shop freischalten'],
    },
  },
  {
    projekt: 'Umzug des Serverraums',
    teile: {
      Vorbereitung: ['Inventarliste erstellen', 'Wartungsfenster festlegen', 'Datensicherung durchführen'],
      Umzug: ['Server herunterfahren', 'Racks transportieren', 'Server einbauen'],
      Inbetriebnahme: ['Verkabelung prüfen', 'Dienste starten', 'Monitoring prüfen'],
      Dokumentation: ['Netzwerkplan aktualisieren', 'Übergabe an den Betrieb'],
    },
  },
];

export function psp(r) {
  const p = r.wahl(PSP);
  const teile = Object.keys(p.teile);
  const pakete = r.mische(teile.flatMap((t) => p.teile[t].map((a) => ({ a, t })))).slice(0, 6);
  return {
    titel: 'Projektstrukturplan',
    sp: 'AP1-1-2-1',
    text: `Projekt **${p.projekt}**: Ordne jedes Arbeitspaket der passenden Teilaufgabe im Projektstrukturplan zu.`,
    psp: { projekt: p.projekt, teile: p.teile },
    felder: pakete.map(({ a, t }, i) => ({ id: `p${i}`, label: a, typ: 'auswahl', erwartet: t, optionen: teile })),
    loesung: [`Ebene 1: Projekt „${p.projekt}"`, ...teile.map((t, i) => `${i + 1} ${t}: ${p.teile[t].map((a, j) => `${i + 1}.${j + 1} ${a}`).join(' · ')}`), 'Der PSP gliedert das Projekt in Teilaufgaben und Arbeitspakete – was zu tun ist, noch ohne Zeitplan.'],
  };
}

export const ERZEUGER = { berechnen, aufbauen, gantt, psp };
export { WERTE, WERT_NAME };
