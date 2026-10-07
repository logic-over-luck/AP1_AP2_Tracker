// Baut Nachschlagetabellen über die Inhaltsdaten. Rein, ohne Browser-Abhängigkeit,
// damit die Tests sie mit Node laden können.

export const RAEUME = ['AP1', 'AP2', 'WISO'];
export const PRIO_RANG = { hoch: 3, mittel: 2, normal: 1 };
export const PRIO_NAME = { hoch: 'Hoch', mittel: 'Mittel', normal: 'Normal' };

export function baueIndex(daten) {
  const raeume = new Map();
  const ordner = new Map();
  const bloecke = new Map();
  const sp = new Map(Object.entries(daten.sp));
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
        // Block-Priorität = Durchschnitt der Stichpunkte. Das Maximum wäre zu grob: Fast jeder
        // Block hat irgendeinen gut belegten Stichpunkt.
        const schnitt = spListe.reduce((a, s) => a + PRIO_RANG[s.prio], 0) / Math.max(1, spListe.length);
        const prio = schnitt >= 2.5 ? 'hoch' : schnitt >= 1.5 ? 'mittel' : 'normal';
        const block = {
          ...b,
          raum: r.id,
          ordner: o.id,
          prio,
          gewicht: spListe.reduce((a, s) => a + s.gewicht, 0),
          arten: [...new Set(spListe.map((s) => s.art))],
        };
        bloecke.set(b.id, block);
        raum.bloeckeListe.push(block);
        ord.spIds.push(...b.sp);
        raum.spAnzahl += b.sp.length;
      }
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
    raumVon: (id) => (id.startsWith('WISO') ? 'WISO' : id.slice(0, 3)),
  };
}
