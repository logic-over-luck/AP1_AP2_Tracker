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
//   neue Stichpunkte gelten als „Wissen“. Die alten Kurzfassungen und Rahmentexte werden nicht gezeigt.

import fs from 'node:fs';
import path from 'node:path';
import { BELEG_GEWICHT, stufeFuer } from './daten.mjs';

const ERSTE_AKTUELLE_PRUEFUNG = '2025F'; // Katalog gilt ab AP1 Frühjahr 2025 (UMBAU.md 6)

export function ladeLernplanAp1(wurzel) {
  const ordner = path.join(wurzel, 'umbau', 'lernplan', 'ap1');
  return fs
    .readdirSync(ordner)
    .filter((f) => /^AP1-\d+\.json$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/g)[1]) - Number(b.match(/\d+/g)[1]))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8')));
}

function wichtigkeitAusTeilaufgaben(teilaufgaben) {
  const jePruefung = new Map();
  for (const t of teilaufgaben ?? []) {
    const p = t.split('-')[0];
    const g = p >= ERSTE_AKTUELLE_PRUEFUNG ? BELEG_GEWICHT.original.aktuell : BELEG_GEWICHT.original.alt;
    jePruefung.set(p, Math.max(jePruefung.get(p) ?? 0, g));
  }
  const wert = [...jePruefung.values()].reduce((a, b) => a + b, 0);
  return { wert: Math.round(wert * 100) / 100, pruefungen: [...jePruefung.entries()].sort(), stufe: stufeFuer(wert) };
}

export function vorschauAp1(daten, wurzel) {
  const plaene = ladeLernplanAp1(wurzel);
  const altSp = daten.sp;

  // alte Können-ID → Eintrag aus alt_neu; neue Können-ID → Stichpunkt
  const altNeu = new Map();
  for (const p of plaene) for (const a of p.alt_neu?.koennen ?? []) altNeu.set(a.alt, a);
  const kNachSp = new Map();
  for (const p of plaene) for (const t of p.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) kNachSp.set(k.id, s.id);

  // Karten umhängen
  const zaehler = { bleiben: 0, angepasst: 0, umgehaengt: 0, gestrichen: 0, ohneAussage: 0 };
  const karten = [];
  for (const k of daten.karten) {
    if (!k.sp.startsWith('AP1')) {
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
    if (!a) throw new Error(`Vorschau AP1: Karte ${k.id} hängt an ${k.k}, das in keinem alt_neu steht`);
    if (a.status === 'gestrichen' || !a.neu) {
      zaehler.gestrichen++;
      continue;
    }
    const sp = kNachSp.get(a.neu);
    if (!sp) throw new Error(`Vorschau AP1: ${a.alt} → ${a.neu}, die neue Aussage gibt es im Lernplan nicht`);
    if (a.status === 'verschoben') zaehler.umgehaengt++;
    else if (a.status === 'angepasst') zaehler.angepasst++;
    else zaehler.bleiben++;
    karten.push({ ...k, k: a.neu, sp });
  }
  const kartenJeK = new Map();
  for (const k of karten) if (k.k) kartenJeK.set(k.k, (kartenJeK.get(k.k) ?? 0) + 1);

  // Herkunft einer neuen Aussage im alten Stand
  const vorgaenger = new Map();
  for (const a of altNeu.values()) if (a.neu) vorgaenger.set(a.neu, a);

  const sp = Object.fromEntries(Object.entries(altSp).filter(([, s]) => s.raum !== 'AP1'));
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
        const alt = altSp[s.id];
        const w = wichtigkeitAusTeilaufgaben(s.teilaufgaben);
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
            status,
            von: status === 'verschoben' ? v.alt : null,
            grund: v && status !== 'übernommen' ? v.grund : null,
            karten: n,
          };
        });
        kuer += (s.kuer ?? []).length;
        sp[s.id] = {
          id: s.id,
          raum: 'AP1',
          ordner: p.oberblock.id,
          block: t.id,
          pos: i + 1,
          titel: s.titel,
          art: alt?.art ?? 'Wissen',
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
            istNeu: !alt,
            koennen,
            grenzen: (s.grenzen ?? []).map((g) => ({ text: g.text, begruendung: g.begruendung ?? null, katalog: g.katalog ?? [] })),
            kuer: (s.kuer ?? []).map((k) => ({ text: k.text, grund: k.grund ?? null })),
          },
        };
        return s.id;
      }),
    })),
  }));

  const raeume = daten.raeume.map((r) => (r.id === 'AP1' ? { ...r, ordner } : r));
  const spAp1 = Object.values(sp).filter((s) => s.raum === 'AP1');

  return {
    ...daten,
    raeume,
    sp,
    karten,
    // Glossar-Verweise auf Stichpunkte, die es nicht mehr gibt, fallen weg (wie in ladeDaten)
    glossar: daten.glossar.map((g) => ({ ...g, sp: g.sp.filter((id) => sp[id]) })),
    vorschau: {
      raum: 'AP1',
      regelwerk: plaene[0]?.meta?.regelwerk_version ?? null,
      stand: plaene.map((p) => p.meta?.stand).filter(Boolean).sort().at(-1) ?? null,
      ordner: plaene.length,
      bloecke: plaene.reduce((a, p) => a + p.themenbloecke.length, 0),
      stichpunkte: spAp1.length,
      neueStichpunkte: spAp1.filter((s) => s.neu.istNeu).length,
      koennen: anzahlK,
      neueOhneKarten,
      kuer,
      karten: zaehler,
    },
  };
}
