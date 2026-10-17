// Baut Nachschlagetabellen über die Inhaltsdaten. Rein, ohne Browser-Abhängigkeit,
// damit die Tests sie mit Node laden können.

import { wichtigkeitRaum, stufenVerteilung, terminVergleich } from './wichtigkeit.js';

export const RAEUME = ['AP1', 'PB1', 'PB2', 'AP2', 'WISO']; // AP2 nur im alten Stand (LERNSTUDIO_AP1=alt)

// Lernstand-Umzug (P6): alte IDs (Stichpunkte, Blöcke) zeigen auf ihre neuen. Kommt aus umbau/umzug.json über die
// Vorschau (daten.umzug). Das Ereignisprotokoll bleibt unverändert; übersetzt wird beim Ableiten.
export function baueUmzug(daten) {
  const spAlias = new Map(Object.entries(daten.umzug?.sp ?? {}));
  const blockAlias = new Map(Object.entries(daten.umzug?.bloecke ?? {}));
  const raumAlias = new Map(Object.entries(daten.umzug?.raeume ?? {}));
  const sp = (id) => (id && spAlias.has(id) ? spAlias.get(id) : id);
  const block = (id) => (id && blockAlias.has(id) ? blockAlias.get(id) : id);
  const spObjekt = (o) => (o ? Object.fromEntries(Object.entries(o).map(([k, v]) => [sp(k), v])) : o);
  function umziehen(ev) {
    if (!spAlias.size && !blockAlias.size && !raumAlias.size) return ev;
    switch (ev.e) {
      case 'sp':
        return spAlias.has(ev.id) ? { ...ev, id: sp(ev.id) } : ev;
      case 'wdh':
        return blockAlias.has(ev.id) ? { ...ev, id: block(ev.id) } : ev;
      case 'aufgabe':
        return spAlias.has(ev.sp) ? { ...ev, sp: sp(ev.sp) } : ev;
      case 'notiz':
        return spAlias.has(ev.id) ? { ...ev, id: sp(ev.id) } : ev;
      case 'pruefung':
        return ev.sp ? { ...ev, sp: spObjekt(ev.sp) } : ev;
      case 'termin':
        return raumAlias.has(ev.r) ? { ...ev, r: raumAlias.get(ev.r) } : ev;
      default:
        return ev;
    }
  }
  return { sp, block, umziehen, spAlias };
}

// Map, die alte Stichpunkt-IDs (z. B. aus Trainern und Prüfungssätzen) auf den neuen Stichpunkt auflöst.
// Iteration und size bleiben bei den echten Einträgen.
class SpMap extends Map {
  constructor(eintraege, alias) {
    super(eintraege);
    this.alias = alias;
  }
  get(id) {
    return super.get(id) ?? (this.alias?.has(id) ? super.get(this.alias.get(id)) : undefined);
  }
  has(id) {
    return super.has(id) || (!!this.alias?.has(id) && super.has(this.alias.get(id)));
  }
}
export function baueIndex(daten) {
  const raeume = new Map();
  const ordner = new Map();
  const bloecke = new Map();
  const umzug = baueUmzug(daten);
  const sp = new SpMap(Object.entries(daten.sp), umzug.spAlias);
  const karten = new Map();
  const kartenJeSp = new Map();
  const kartenJeBlock = new Map();
  const kartenJeOrdner = new Map();
  const kartenJeRaum = new Map();

  for (const r of daten.raeume) {
    const raum = { ...r, spAnzahl: 0, bloeckeListe: [] };
    raeume.set(r.id, raum);
    for (const o of r.ordner) {
      const ord = { ...o, raum: r.id, spIds: [] };
      ordner.set(o.id, ord);
      for (const b of o.bloecke) {
        const spListe = b.sp.map((id) => sp.get(id)).filter(Boolean);
        const block = {
          ...b,
          raum: r.id,
          ordner: o.id,
          wichtig: null, // unten, wenn die Wichtigkeit der Stichpunkte feststeht
          arten: [...new Set(spListe.map((s) => s.art))],
        };
        bloecke.set(b.id, block);
        raum.bloeckeListe.push(block);
        ord.spIds.push(...b.sp);
        raum.spAnzahl += b.sp.length;
      }
    }
    // Wichtigkeit je Stichpunkt (src/daten/wichtigkeit.js), zusammengefasst je Block und Themenbereich
    const raumSp = raum.bloeckeListe.flatMap((b) => b.sp.map((id) => sp.get(id)).filter(Boolean));
    const w = wichtigkeitRaum(raumSp);
    raum.wichtig = w.raum;
    for (const s of raumSp) s.wichtig = w.je.get(s.id);
    // Teilaufgaben des Raums: wie viele Stichpunkte teilen sich eine Teilaufgabe (für den Anteil je Themenbereich, je 1/m)
    const teiler = new Map();
    for (const s of raumSp) for (const t of s.ta ?? []) teiler.set(t, (teiler.get(t) ?? 0) + 1);
    const aufgabenAnteil = (liste) =>
      teiler.size
        ? liste.reduce((a, s) => a + (s.ta ?? []).reduce((x, t) => x + 1 / teiler.get(t), 0), 0) / teiler.size
        : liste.reduce((a, s) => a + s.wichtig.quote, 0) / Math.max(1e-9, raumSp.reduce((a, s) => a + s.wichtig.quote, 0));
    for (const b of raum.bloeckeListe) {
      const liste = b.sp.map((id) => sp.get(id)).filter(Boolean);
      const termine = new Set(liste.flatMap((s) => s.wichtig.termine));
      b.wichtig = { ...stufenVerteilung(liste), x: termine.size, n: w.raum.n };
    }
    for (const o of r.ordner) {
      const ord = ordner.get(o.id);
      const liste = ord.spIds.map((id) => sp.get(id)).filter(Boolean);
      ord.wichtig = { ...stufenVerteilung(liste), anteil: aufgabenAnteil(liste), aufgaben: teiler.size };
    }
  }

  // Belege aus einem anderen Prüfungsteil (UMBAU.md P74): nur Anzeige – „auch in 4 von 10 PB2-Prüfungen“
  for (const s of new Set(sp.values()))
    if (s.wichtig)
      s.wichtig.quer = Object.entries(s.quer ?? {})
        .filter(([r]) => raeume.has(r))
        .map(([r, termine]) => ({ raum: r, name: raeume.get(r).name, x: Object.keys(termine).length, n: raeume.get(r).wichtig?.n ?? 0, termine: Object.keys(termine).sort(terminVergleich) }));

  // Fundament: welche Stichpunkte (auch in späteren Räumen) auf einem Stichpunkt aufbauen (Feld „Baut auf“, E2)
  for (const s of new Set(sp.values())) s.grundlageFuer = [];
  for (const s of new Set(sp.values()))
    for (const id of s.neu?.bautAuf ?? []) {
      const ziel = sp.get(id);
      if (ziel && ziel !== s && !ziel.grundlageFuer.includes(s.id)) ziel.grundlageFuer.push(s.id);
    }

  const push = (map, key, wert) => {
    let liste = map.get(key);
    if (!liste) map.set(key, (liste = []));
    liste.push(wert);
  };
  for (const k of daten.karten) {
    const s = sp.get(k.sp);
    if (!s) continue;
    karten.set(k.id, k);
    push(kartenJeSp, s.id, k.id);
    push(kartenJeBlock, s.block, k.id);
    push(kartenJeOrdner, s.ordner, k.id);
    push(kartenJeRaum, s.raum, k.id);
  }

  return {
    daten,
    raeume,
    ordner,
    bloecke,
    sp,
    karten,
    kartenJeSp,
    kartenJeBlock,
    kartenJeOrdner,
    kartenJeRaum,
    glossar: daten.glossar,
    trainer: daten.trainer ?? {},
    umzug,
    // Raum zu einer Stichpunkt-, Karten-, Block- oder Ordner-ID (auch alte IDs über den Umzug)
    raumVon: (id) =>
      sp.get(id)?.raum ?? sp.get(karten.get(id)?.sp)?.raum ?? bloecke.get(umzug.block(id))?.raum ?? ordner.get(id)?.raum ?? (id.startsWith('WISO') ? 'WISO' : id.slice(0, 3)),
  };
}
