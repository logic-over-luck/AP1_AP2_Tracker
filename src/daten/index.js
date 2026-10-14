// Baut Nachschlagetabellen über die Inhaltsdaten. Rein, ohne Browser-Abhängigkeit,
// damit die Tests sie mit Node laden können.

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
// Wichtigkeit (siehe tools/daten.mjs): wie oft und wie aktuell ein Thema geprüft wurde, dazu Punkte.
export const PRIO_RANG = { top: 4, hoch: 3, mittel: 2, normal: 1 };
export const PRIO_NAME = { top: 'Top-Thema', hoch: 'Häufig geprüft', mittel: 'Gelegentlich geprüft', normal: 'Selten geprüft' };
// Blockstufe relativ zum wichtigsten Block des Raums: WiSo hat weniger ausgewertete Prüfungen als
// AP1/AP2, ein Thema, das in allen dran war, ist dort trotzdem ein Top-Thema.
const BLOCK_ANTEIL = [
  ['top', 0.8],
  ['hoch', 0.5],
  ['mittel', 0.2],
  ['normal', -Infinity],
];

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
                // Wie oft war der Block als Ganzes dran? Jede Prüfung zählt einmal (stärkster Beleg), dazu Punkte.
        const jePruefung = new Map();
        for (const s of spListe) for (const [p, g] of s.pruef ?? []) jePruefung.set(p, Math.max(jePruefung.get(p) ?? 0, g));
        const punkte = Math.max(0, ...spListe.map((s) => s.punkte ?? 0)) || null;
        const wert = [...jePruefung.values()].reduce((a, g) => a + g, 0) + (punkte >= 15 ? 1 : punkte >= 10 ? 0.5 : 0);
        const pruefungen = jePruefung.size;
        const block = {
          ...b,
          raum: r.id,
          ordner: o.id,
          prio: 'normal', // wird unten relativ zum Raum gesetzt
          pruefungen,
          punkte,
          // feiner Gleichstandsbrecher: Anteil gut belegter Stichpunkte im Block
          gewicht: wert + spListe.reduce((a, s) => a + s.gewicht, 0) / Math.max(1, spListe.length) / 100,
          arten: [...new Set(spListe.map((s) => s.art))],
        };
        bloecke.set(b.id, block);
        raum.bloeckeListe.push(block);
        ord.spIds.push(...b.sp);
        raum.spAnzahl += b.sp.length;
      }
    }
    const hoechster = Math.max(0, ...raum.bloeckeListe.map((b) => b.gewicht));
    for (const b of raum.bloeckeListe) {
      const anteil = hoechster ? b.gewicht / hoechster : 0;
      b.prio = b.gewicht > 0 ? BLOCK_ANTEIL.find(([, g]) => anteil >= g)[0] : 'normal';
    }
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
