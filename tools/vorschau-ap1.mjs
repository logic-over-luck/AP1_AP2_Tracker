// Vorschau: Der Raum AP1 zeigt den neuen Lernplan aus umbau/lernplan/ap1/AP1-*.json statt der alten Inhalte.
//
// Reiner Lese- und Umwandlungsschritt im Build (UMBAU.md 5, Abnahme M1/M2). Inhaltsdatei, inhalte/ und die
// Lernpläne bleiben unverändert. Rückgängig: LERNSTUDIO_AP1=alt beim Bauen setzen oder den Aufruf in
// tools/build.mjs entfernen. AP2 und WiSo werden nicht angefasst.
//
// Was übernommen wird:
// – Oberblock → Ordner, Themenblock → Block (mit Satz), Stichpunkt mit Titel, Ziel, Können-Aussagen, Grenzen,
//   Kür (freiwillig, nur Text – kein eigener Stichpunkt, zählt also nicht zum Fortschritt), Hinweis;
//   Stufe und Herkunft je Aussage, Begründungen von Grenzen und Kür für die ausklappbare Ansicht.
// – Lernkarten über alt_neu: übernommen und angepasst bleiben an ihrer Aussage, verschoben werden umgehängt,
//   gestrichen fallen weg. Neue Aussagen haben keine Karten und sind gekennzeichnet.
// – Wichtigkeit (Marke am Block) aus den zugeordneten Teilaufgaben des Lernplans: jede Prüfung zählt einmal,
//   aktueller Katalog (ab 2025F) 1, alter Katalog 0,6 – wie bisher, aber ohne Punkte-Zuschlag (Punkte stehen
//   nicht im Lernplan).
// – Art (Symbol, Lernprompt-Zusatz) und Gegenstücke übernimmt ein Stichpunkt mit alter ID vom alten Stand;
//   neue Stichpunkte leiten die Art aus den Aufgabentypen ihrer Teilaufgaben ab (P27, artAusTypen). Die alten Kurzfassungen und Rahmentexte werden nicht gezeigt.
// – Neue Karten (Schicht 5, umbau/auftraege/AP1-karten.md): Liegt für einen Ordner eine Datei
//   umbau/karten/ap1/AP1-<n>.json vor, ersetzen deren Karten alle umgehängten alten Karten, deren Stichpunkt
//   in diesem Ordner liegt. Maßgeblich ist der Zielordner: Eine alte Karte, deren Aussage in einen anderen
//   Ordner verschoben wurde, wird in der Datei dieses anderen Ordners entschieden.
// – Kurzfassung und Erklärungen (Schicht 5): Liegt für einen Ordner umbau/kurz/ap1/AP1-<n>.json vor, bekommt jeder
//   Stichpunkt einen Teaser (neu.kurz, unter dem Ziel) und jede Können-Aussage ihre Erklärung (neu.koennen[].erklaerung,
//   in der App aufklappbar an der Aussage). Text mit einfacher Auszeichnung wie bei Lernkarten.
// – Importe (E2/P36): baut_auf eines Stichpunkts als neu.bautAuf (Sprung in den früheren Raum), das Feld neu einer
//   Können-Aussage ({ gegenueber, was }) an der Aussage. Abgenommene Räume (abgenommen) zeigen keinen Hinweis mehr.
// – WISO (Schritt 6): ersetzt den alten Raum WISO an seiner Stelle, Name „WiSo“ bleibt. IDs bleiben erhalten (P48);
//   alte Stichpunkt- und Block-IDs, die es nicht mehr gibt, ziehen über umbau/umzug.json um (vorschauWiso).

import fs from 'node:fs';
import path from 'node:path';
import { BELEG_GEWICHT, stufeFuer } from './daten.mjs';

// Räume mit neuem Lernplan in der Vorschau. appRaum: Raum der App, der den neuen Lernplan zeigt; ersetzt: alter
// App-Raum, an dessen Stelle er tritt (sonst appRaum selbst); altPrefix: Präfix der alten Stichpunkte und Karten;
// ersteAktuelle: erster Termin mit aktuellem Katalog (UMBAU.md 6). Aus dem alten Raum AP2 (Fachprüfungen) werden
// die Räume PB1 und PB2 (je neuer Lernplan; solange PB2 nicht gebaut ist: Platzhalter mit den alten Stichpunkten,
// pb2Platzhalter). abgenommen: Der Projektinhaber hat den Lernplan abgenommen (UMBAU.md P45); dann zeigt die App
// keinen Hinweis „noch nicht endgültig“ mehr.
export const RAEUME_VORSCHAU = {
  AP1: { teil: 'AP1', dir: 'ap1', appRaum: 'AP1', altPrefix: 'AP1', ersteAktuelle: '2025F', titel: null, abgenommen: true },
  PB1: { teil: 'PB1', dir: 'pb1', appRaum: 'PB1', ersetzt: 'AP2', altPrefix: 'AP2', ersteAktuelle: '2025S', titel: 'Planen eines Softwareproduktes', abgenommen: true },
  PB2: { teil: 'PB2', dir: 'pb2', appRaum: 'PB2', ersetzt: 'AP2', altPrefix: 'AP2', ersteAktuelle: '2025S', titel: 'Entwicklung und Umsetzung von Algorithmen', abgenommen: true },
  WISO: { teil: 'WISO', dir: 'wiso', appRaum: 'WISO', altPrefix: 'WISO', ersteAktuelle: '2025S', titel: null, abgenommen: true },
};
const AP1 = RAEUME_VORSCHAU.AP1;
const dateiMuster = (cfg) => new RegExp(`^${cfg.teil}-\\d+\\.json$`);

export function ladeLernplanAp1(wurzel, cfg = AP1) {
  const ordner = path.join(wurzel, 'umbau', 'lernplan', cfg.dir);
  if (!fs.existsSync(ordner)) return [];
  return fs
    .readdirSync(ordner)
    .filter((f) => dateiMuster(cfg).test(f))
    .sort((a, b) => Number(a.match(/\d+/g)[1]) - Number(b.match(/\d+/g)[1]))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8')));
}

// Neue Kartendateien je Ordner: Map Ordner-ID → Inhalt
export function ladeKartenAp1(wurzel, cfg = AP1) {
  const ordner = path.join(wurzel, 'umbau', 'karten', cfg.dir);
  const dateien = new Map();
  if (!fs.existsSync(ordner)) return dateien;
  for (const f of fs.readdirSync(ordner).filter((f) => dateiMuster(cfg).test(f)).sort()) {
    dateien.set(f.replace(/\.json$/, ''), JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8')));
  }
  return dateien;
}

// Teaser je Stichpunkt und Erklärung je Können-Aussage aus umbau/kurz/ap1/
export function ladeKurzAp1(wurzel, cfg = AP1) {
  const ordner = path.join(wurzel, 'umbau', 'kurz', cfg.dir);
  const teaser = new Map();
  const erklaerung = new Map();
  if (fs.existsSync(ordner)) {
    for (const f of fs.readdirSync(ordner).filter((f) => dateiMuster(cfg).test(f)).sort()) {
      const d = JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8'));
      for (const [id, text] of Object.entries(d.teaser ?? {})) teaser.set(id, text);
      for (const [id, text] of Object.entries(d.erklaerung ?? {})) erklaerung.set(id, text);
    }
  }
  return { teaser, erklaerung };
}

export const ordnerVon = (id) => id.split('-').slice(0, 2).join('-');

// P27: Art eines Stichpunkts aus den Aufgabentypen seiner Teilaufgaben (umbau/zuordnung). Zeichnen (diagramm),
// Rechnen (berechnen) oder Schreiben (code_schreiben, text), wenn mindestens die Hälfte der Teilaufgaben diese
// Art hat; bei Gleichstand in dieser Reihenfolge; sonst und ohne Teilaufgaben „Wissen“.
export function artAusTypen(typen) {
  const n = typen.length;
  if (!n) return 'Wissen';
  const zahl = {
    Zeichnen: typen.filter((t) => t === 'diagramm').length,
    Rechnen: typen.filter((t) => t === 'berechnen').length,
    Schreiben: typen.filter((t) => t === 'code_schreiben' || t === 'text').length,
  };
  const [art, anzahl] = Object.entries(zahl).reduce((a, b) => (b[1] > a[1] ? b : a));
  return anzahl * 2 >= n ? art : 'Wissen';
}

export function ladeTypenAp1(wurzel, cfg = AP1) {
  const ordner = path.join(wurzel, 'umbau', 'zuordnung', cfg.dir);
  const typ = new Map();
  if (!fs.existsSync(ordner)) return typ;
  for (const f of fs.readdirSync(ordner).filter((f) => f.endsWith('.json'))) {
    for (const [id, t] of Object.entries(JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8')).teilaufgaben)) typ.set(id, t.typ);
  }
  return typ;
}

function wichtigkeitAusTeilaufgaben(teilaufgaben, ersteAktuelle) {
  const jePruefung = new Map();
  for (const t of teilaufgaben ?? []) {
    const p = t.split('-')[0];
    const g = p >= ersteAktuelle ? BELEG_GEWICHT.original.aktuell : BELEG_GEWICHT.original.alt;
    jePruefung.set(p, Math.max(jePruefung.get(p) ?? 0, g));
  }
  const wert = [...jePruefung.values()].reduce((a, b) => a + b, 0);
  return { wert: Math.round(wert * 100) / 100, pruefungen: [...jePruefung.entries()].sort(), stufe: stufeFuer(wert) };
}

export function vorschauAp1(daten, wurzel) {
  return vorschauRaum(daten, wurzel, AP1);
}

// Vorschau aller Räume, für die ein Lernplan vorliegt (AP1, PB1, dann PB2 bzw. sein Platzhalter, dann WISO)
export function vorschauAlle(daten, wurzel) {
  let d = daten;
  for (const cfg of [RAEUME_VORSCHAU.AP1, RAEUME_VORSCHAU.PB1]) if (ladeLernplanAp1(wurzel, cfg).length) d = vorschauRaum(d, wurzel, cfg);
  if (ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.PB1).length) {
    d = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.PB2).length ? vorschauPb2(daten, d, wurzel) : pb2Platzhalter(daten, d, wurzel);
  }
  if (ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.WISO).length) d = vorschauWiso(d, wurzel);
  return d;
}

// Raum WISO mit neuem Lernplan an der Stelle des alten. Die IDs bleiben erhalten (P48); alte Stichpunkte und Blöcke,
// die es im neuen Plan nicht mehr gibt, ziehen laut umbau/umzug.json um (P6) – zusätzlich zum Umzug von AP2.
export function vorschauWiso(d, wurzel) {
  const aus = vorschauRaum(d, wurzel, RAEUME_VORSCHAU.WISO);
  const umzugDatei = path.join(wurzel, 'umbau', 'umzug.json');
  const u = fs.existsSync(umzugDatei) ? JSON.parse(fs.readFileSync(umzugDatei, 'utf8')) : { stichpunkte: {}, bloecke: {} };
  const blockDa = new Set(aus.raeume.flatMap((r) => r.ordner.flatMap((o) => o.bloecke.map((b) => b.id))));
  const wiso = ([a, n]) => a.startsWith('WISO') && a !== n && typeof n === 'string';
  aus.umzug = {
    sp: { ...(d.umzug?.sp ?? {}), ...Object.fromEntries(Object.entries(u.stichpunkte).filter((e) => wiso(e) && !aus.sp[e[0]] && aus.sp[e[1]])) },
    bloecke: { ...(d.umzug?.bloecke ?? {}), ...Object.fromEntries(Object.entries(u.bloecke).filter((e) => wiso(e) && !blockDa.has(e[0]) && blockDa.has(e[1]))) },
    raeume: { ...(d.umzug?.raeume ?? {}) },
  };
  return aus;
}

// Raum PB2 mit neuem Lernplan. Der Lauf für PB1 hat den alten Raum AP2 schon ersetzt und die alten Karten, deren
// Aussagen nach PB2 gehören, beiseitegelegt; sie kommen hier zurück und laufen über das alt_neu von PB2. Die alten
// AP2-Stichpunkte stehen dem Lauf nur für Art und Gegenstücke zur Verfügung und fallen danach weg. Dazu der
// Lernstand-Umzug (P6) für alle alten AP2-Stichpunkte und -Blöcke (nach PB1 oder PB2); Termine für AP2 gelten für PB1.
export function vorschauPb2(original, d, wurzel) {
  const cfg = RAEUME_VORSCHAU.PB2;
  const plaeneP1 = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.PB1);
  const pb2 = new Set(plaeneP1.flatMap((p) => p.alt_neu.koennen.filter((a) => a.status === 'PB2').map((a) => a.alt)));
  const altAp2 = Object.fromEntries(Object.entries(original.sp).filter(([, s]) => s.raum === 'AP2'));
  const umzugDatei = path.join(wurzel, 'umbau', 'umzug.json');
  const u = fs.existsSync(umzugDatei) ? JSON.parse(fs.readFileSync(umzugDatei, 'utf8')) : { stichpunkte: {}, bloecke: {} };
  const nachPb2 = (id) => (typeof u.stichpunkte[id] === 'string' && u.stichpunkte[id].startsWith('PB2') ? u.stichpunkte[id] : null);
  // Glossar-Verweise auf alte AP2-Stichpunkte, die nach PB2 umziehen, auf das neue Ziel setzen
  const glossar = d.glossar.map((g) => {
    const extra = (original.glossar.find((x) => x.b === g.b)?.sp ?? []).map(nachPb2).filter(Boolean);
    return { ...g, sp: [...new Set([...g.sp, ...extra])] };
  });
  const raeume = [];
  for (const r of d.raeume) {
    raeume.push(r);
    if (r.id === 'PB1') raeume.push({ id: 'AP2', name: 'PB2', titel: cfg.titel, ordner: [] });
  }
  const ein = {
    ...d,
    raeume,
    sp: { ...d.sp, ...altAp2 },
    karten: [...d.karten, ...original.karten.filter((k) => k.k && pb2.has(k.k) && k.sp.startsWith('AP2'))],
    glossar,
  };
  const aus = vorschauRaum(ein, wurzel, cfg);
  const ziel = (n) => typeof n === 'string' && !!aus.sp[n];
  const blockDa = new Set(aus.raeume.flatMap((r) => r.ordner.flatMap((o) => o.bloecke.map((b) => b.id))));
  aus.umzug = {
    sp: Object.fromEntries(Object.entries(u.stichpunkte).filter(([a, n]) => a.startsWith('AP2') && ziel(n))),
    bloecke: Object.fromEntries(Object.entries(u.bloecke).filter(([a, n]) => a.startsWith('AP2') && blockDa.has(n))),
    raeume: { AP2: 'PB1' },
  };
  return aus;
}

// Raum PB2, bis sein Lernplan gebaut ist: die alten AP2-Stichpunkte, deren Aussagen laut alt_neu von PB1 nach PB2
// gehören, mit genau diesen Aussagen und ihren alten Karten (IDs unverändert, Lernstand bleibt). Dazu der
// Lernstand-Umzug (P6) aus umbau/umzug.json als daten.umzug: alte Stichpunkt- und Block-IDs, die jetzt in PB1
// wohnen, zeigen auf die neuen; Termine für AP2 gelten für PB1.
export function pb2Platzhalter(original, d, wurzel) {
  const plaene = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.PB1);
  const pb2 = new Set(plaene.flatMap((p) => p.alt_neu.koennen.filter((a) => a.status === 'PB2').map((a) => a.alt)));
  const sp = { ...d.sp };
  const behalten = new Set();
  for (const s of Object.values(original.sp)) {
    if (s.raum !== 'AP2') continue;
    const koennen = s.koennen.filter(([id]) => pb2.has(id));
    if (!koennen.length) continue;
    sp[s.id] = { ...s, raum: 'PB2', koennen };
    behalten.add(s.id);
  }
  const alt = original.raeume.find((r) => r.id === 'AP2');
  const ordner = alt.ordner
    .map((o) => ({ ...o, bloecke: o.bloecke.map((b) => ({ ...b, sp: b.sp.filter((id) => behalten.has(id)) })).filter((b) => b.sp.length) }))
    .filter((o) => o.bloecke.length);
  const bloeckePb2 = new Set(ordner.flatMap((o) => o.bloecke.map((b) => b.id)));
  const karten = [...d.karten, ...original.karten.filter((k) => k.k && pb2.has(k.k) && behalten.has(k.sp))];
  const raeume = [];
  for (const r of d.raeume) {
    raeume.push(r);
    if (r.id === 'PB1') raeume.push({ id: 'PB2', name: 'PB2', titel: 'Entwicklung und Umsetzung von Algorithmen', ordner });
  }
  const umzugDatei = path.join(wurzel, 'umbau', 'umzug.json');
  const u = fs.existsSync(umzugDatei) ? JSON.parse(fs.readFileSync(umzugDatei, 'utf8')) : { stichpunkte: {}, bloecke: {} };
  const ziel = (n) => typeof n === 'string' && n !== 'offen' && n.startsWith('PB1');
  const umzug = {
    sp: Object.fromEntries(Object.entries(u.stichpunkte).filter(([a, n]) => a.startsWith('AP2') && ziel(n) && !behalten.has(a))),
    bloecke: Object.fromEntries(Object.entries(u.bloecke).filter(([a, n]) => a.startsWith('AP2') && ziel(n) && !bloeckePb2.has(a))),
    raeume: { AP2: 'PB1' },
  };
  const spPb2 = Object.values(sp).filter((s) => s.raum === 'PB2');
  return {
    ...d,
    raeume,
    sp,
    karten,
    umzug,
    glossar: d.glossar.map((g) => ({ ...g, sp: [...new Set([...g.sp, ...(original.glossar.find((x) => x.b === g.b)?.sp ?? []).filter((id) => behalten.has(id))])] })),
    vorschauRaeume: {
      ...d.vorschauRaeume,
      PB2: { raum: 'PB2', alt: true, stichpunkte: spPb2.length, koennen: spPb2.reduce((n, s) => n + s.koennen.length, 0), karten: karten.filter((k) => behalten.has(k.sp)).length },
    },
  };
}

export function vorschauRaum(daten, wurzel, cfg) {
  const plaene = ladeLernplanAp1(wurzel, cfg);
  const R = cfg.appRaum;
  const altSp = daten.sp;

  // alte Können-ID → Eintrag aus alt_neu; neue Können-ID → Stichpunkt
  const altNeu = new Map();
  for (const p of plaene) for (const a of p.alt_neu?.koennen ?? []) altNeu.set(a.alt, a);
  const kNachSp = new Map();
  for (const p of plaene) for (const t of p.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) kNachSp.set(k.id, s.id);

  // Karten umhängen
  const zaehler = { bleiben: 0, angepasst: 0, umgehaengt: 0, gestrichen: 0, ohneAussage: 0, spaeter: 0 };
  const karten = [];
  for (const k of daten.karten) {
    if (!k.sp.startsWith(cfg.altPrefix)) {
      karten.push(k);
      continue;
    }
    if (!k.k) {
      // Karte zum ganzen Stichpunkt: bleibt, solange es ihn gibt
      if ([...kNachSp.values()].includes(k.sp)) {
        karten.push(k);
        zaehler.ohneAussage++;
      } else zaehler.gestrichen++;
      continue;
    }
    const a = altNeu.get(k.k);
    if (!a) throw new Error(`Vorschau ${cfg.teil}: Karte ${k.id} hängt an ${k.k}, das in keinem alt_neu steht`);
    if (a.status === 'PB2') {
      zaehler.spaeter++; // gehört nach PB2, dort später einsortiert
      continue;
    }
    if (a.status === 'gestrichen' || !a.neu) {
      zaehler.gestrichen++;
      continue;
    }
    const sp = kNachSp.get(a.neu);
    if (!sp) throw new Error(`Vorschau ${cfg.teil}: ${a.alt} → ${a.neu}, die neue Aussage gibt es im Lernplan nicht`);
    if (a.status === 'verschoben') zaehler.umgehaengt++;
    else if (a.status === 'angepasst') zaehler.angepasst++;
    else zaehler.bleiben++;
    karten.push({ ...k, k: a.neu, sp });
  }

  // Neue Karten je Ordner einsetzen (an der Stelle der ersten ersetzten Karte, sonst am Ende)
  const kartenDateien = ladeKartenAp1(wurzel, cfg);
  const kartenNeu = { ordner: [...kartenDateien.keys()], bleibt: 0, bearbeitet: 0, entfernt: 0, neu: 0 };
  if (kartenDateien.size) {
    const ersetzt = new Set();
    const mitNeuen = [];
    const einsetzen = (o) => {
      ersetzt.add(o);
      for (const k of kartenDateien.get(o).karten) mitNeuen.push({ id: k.id, sp: k.sp, k: k.k, v: k.vorne, h: k.hinten });
    };
    for (const k of karten) {
      const o = k.sp.startsWith(cfg.teil) ? ordnerVon(k.sp) : null;
      if (!o || !kartenDateien.has(o)) mitNeuen.push(k);
      else if (!ersetzt.has(o)) einsetzen(o);
    }
    for (const o of kartenDateien.keys()) if (!ersetzt.has(o)) einsetzen(o);
    karten.length = 0;
    karten.push(...mitNeuen);
    for (const d of kartenDateien.values()) for (const p of d.protokoll ?? []) kartenNeu[p.entscheidung] = (kartenNeu[p.entscheidung] ?? 0) + 1;
  }

  const kartenJeK = new Map();
  for (const k of karten) if (k.k) kartenJeK.set(k.k, (kartenJeK.get(k.k) ?? 0) + 1);

  // Herkunft einer neuen Aussage im alten Stand
  const vorgaenger = new Map();
  for (const a of altNeu.values()) if (a.neu) vorgaenger.set(a.neu, a);

  const kurzTexte = ladeKurzAp1(wurzel, cfg);
  const typen = ladeTypenAp1(wurzel, cfg);
  const sp = Object.fromEntries(Object.entries(altSp).filter(([, s]) => s.raum !== (cfg.ersetzt ?? R)));
  // Neue Räume (PB1): Vorgänger eines Stichpunkts über die Umzugstabelle (P6), für Art und Gegenstücke
  const altVon = new Map();
  if (cfg.teil !== 'AP1' && fs.existsSync(path.join(wurzel, 'umbau', 'umzug.json'))) {
    const u = JSON.parse(fs.readFileSync(path.join(wurzel, 'umbau', 'umzug.json'), 'utf8'));
    for (const [a, n] of Object.entries(u.stichpunkte)) if (n && n !== 'offen' && !altVon.has(n)) altVon.set(n, a);
  }
  let anzahlK = 0;
  let neueOhneKarten = 0;
  let kuer = 0;
  const ordner = plaene.map((p) => ({
    id: p.oberblock.id,
    titel: p.oberblock.titel,
    bloecke: p.themenbloecke.map((t) => ({
      id: t.id,
      titel: t.titel,
      satz: t.satz ?? null,
      sp: t.stichpunkte.map((s, i) => {
        const alt = altSp[s.id] ?? altSp[altVon.get(s.id)];
        const w = wichtigkeitAusTeilaufgaben(s.teilaufgaben, cfg.ersteAktuelle);
        const koennen = s.koennen.map((k) => {
          const v = vorgaenger.get(k.id);
          const status = !v ? 'neu' : v.status === 'verschoben' ? 'verschoben' : v.status;
          const n = kartenJeK.get(k.id) ?? 0;
          if (status === 'neu' && !n) neueOhneKarten++;
          anzahlK++;
          return {
            id: k.id,
            stufe: k.stufe,
            herkunft: k.herkunft,
            vorgegeben: k.vorgegeben ?? null,
            erklaerung: kurzTexte.erklaerung.get(k.id) ?? null,
            status,
            von: status === 'verschoben' ? v.alt : null,
            grund: v && status !== 'übernommen' ? v.grund : null,
            karten: n,
            // E2/P36: Aussage zu importierten Bausteinen – was gegenüber den genannten früheren Stichpunkten neu ist
            neu: k.neu ? { gegenueber: k.neu.gegenueber ?? [], was: k.neu.was ?? '' } : null,
          };
        });
        kuer += (s.kuer ?? []).length;
        sp[s.id] = {
          id: s.id,
          raum: R,
          ordner: p.oberblock.id,
          block: t.id,
          pos: i + 1,
          titel: s.titel,
          art: alt?.art ?? artAusTypen((s.teilaufgaben ?? []).map((t) => typen.get(t)).filter(Boolean)),
          rahmen: null,
          unklar: null,
          koennen: s.koennen.map((k) => [k.id, k.text]),
          prio: w.stufe,
          gewicht: w.wert,
          pruef: w.pruefungen,
          punkte: null,
          gegen: alt?.gegen ?? [],
          kurz: null,
          neu: {
            ziel: s.ziel,
            hinweis: s.hinweis ?? null,
            kurz: kurzTexte.teaser.get(s.id) ?? null,
            istNeu: !alt,
            // E2: Stichpunkte früherer Räume (AP1, PB1), auf denen dieser aufbaut
            bautAuf: s.baut_auf ?? [],
            koennen,
            grenzen: (s.grenzen ?? []).map((g) => ({ text: g.text, begruendung: g.begruendung ?? null, katalog: g.katalog ?? [] })),
            kuer: (s.kuer ?? []).map((k) => ({ text: k.text, grund: k.grund ?? null })),
          },
        };
        return s.id;
      }),
    })),
  }));

  const raeume = daten.raeume.map((r) => (r.id === (cfg.ersetzt ?? R) ? { ...r, id: R, name: cfg.ersetzt ? R : r.name, ...(cfg.titel ? { titel: cfg.titel } : {}), ordner } : r));
  const spAp1 = Object.values(sp).filter((s) => s.raum === R);

  const v = {
    raum: cfg.teil,
    abgenommen: !!cfg.abgenommen,
    regelwerk: plaene[0]?.meta?.regelwerk_version ?? null,
    stand: plaene.map((p) => p.meta?.stand).filter(Boolean).sort().at(-1) ?? null,
    ordner: plaene.length,
    bloecke: plaene.reduce((a, p) => a + p.themenbloecke.length, 0),
    stichpunkte: spAp1.length,
    neueStichpunkte: spAp1.filter((s) => s.neu.istNeu).length,
    kurz: spAp1.filter((s) => s.neu.kurz).length,
    erklaerungen: spAp1.reduce((n, s) => n + s.neu.koennen.filter((k) => k.erklaerung).length, 0),
    koennen: anzahlK,
    neueOhneKarten,
    kuer,
    karten: zaehler,
    kartenNeu,
  };
  return {
    ...daten,
    raeume,
    sp,
    karten,
    // Glossar-Verweise auf Stichpunkte, die es nicht mehr gibt, fallen weg (wie in ladeDaten)
    glossar: daten.glossar.map((g) => ({ ...g, sp: g.sp.filter((id) => sp[id]) })),
    vorschau: cfg.teil === 'AP1' ? v : daten.vorschau,
    vorschauRaeume: { ...(daten.vorschauRaeume ?? {}), [R]: v },
  };
}
