// Anordnung des Schemas als ER-Diagramm (wie in einem Datenbank-Werkzeug): Tabellen als Kästen,
// Fremdschlüssel als Linien zur Zieltabelle. Für die Übungsdatenbank ist die Anordnung von Hand
// so gewählt, dass sich keine Linien kreuzen; neue Tabellen (Freies Labor) kommen rechts dazu.

export const MASS = { breite: 190, abstandX: 64, abstandY: 34, kopf: 30, zeile: 21, rand: 8 };

// Spalten von links nach rechts – Beziehungen laufen so nur zwischen Nachbarn
const ANORDNUNG = [['kunde', 'mitarbeiter'], ['bestellung'], ['bestellposition'], ['artikel'], ['kategorie', 'lieferant']];

const hoehe = (t) => MASS.kopf + t.spalten.length * MASS.zeile + 2 * MASS.rand;

export function erLayout(schema) {
  const namen = new Set(schema.map((t) => t.name));
  const spalten = ANORDNUNG.map((s) => s.filter((n) => namen.has(n))).filter((s) => s.length);
  const bekannt = new Set(spalten.flat());
  // Unbekannte Tabellen: je zwei übereinander in weiteren Spalten rechts
  const neu = schema.map((t) => t.name).filter((n) => !bekannt.has(n));
  for (let i = 0; i < neu.length; i += 2) spalten.push(neu.slice(i, i + 2));

  const byName = new Map(schema.map((t) => [t.name, t]));
  const spaltenHoehe = spalten.map((s) => s.reduce((h, n) => h + hoehe(byName.get(n)), 0) + (s.length - 1) * MASS.abstandY);
  const gesamtHoehe = Math.max(0, ...spaltenHoehe);

  const kaesten = new Map();
  spalten.forEach((s, x) => {
    let y = (gesamtHoehe - spaltenHoehe[x]) / 2;
    for (const n of s) {
      const t = byName.get(n);
      kaesten.set(n, { name: n, x: x * (MASS.breite + MASS.abstandX), y, h: hoehe(t), tabelle: t });
      y += hoehe(t) + MASS.abstandY;
    }
  });

  // Mitte einer Spaltenzeile
  const zeileY = (k, spalte) => k.y + MASS.kopf + MASS.rand + k.tabelle.spalten.findIndex(([n]) => n === spalte) * MASS.zeile + MASS.zeile / 2;

  const linien = [];
  for (const k of kaesten.values())
    for (const [spalte, , marke] of k.tabelle.spalten) {
      const m = marke.match(/FK → (\w+)/);
      if (!m || !kaesten.has(m[1])) continue;
      const z = kaesten.get(m[1]);
      const pk = z.tabelle.spalten.find(([, , mk]) => mk.includes('PK'))?.[0] ?? z.tabelle.spalten[0][0];
      const y1 = zeileY(k, spalte);
      const y2 = zeileY(z, pk);
      let d;
      let n; // Position der Beschriftung „n" (Fremdschlüssel-Seite) und „1" (Primärschlüssel-Seite)
      let eins;
      if (z === k) {
        // Selbstbezug: Schleife links am Kasten (rechts laufen die anderen Linien)
        const xl = k.x;
        d = `M${xl} ${y1} H${xl - 22} V${y2} H${xl}`;
        n = [xl - 12, y1 - 5];
        eins = [xl - 12, y2 - 5];
      } else if (z.x > k.x) {
        const x1 = k.x + MASS.breite;
        const x2 = z.x;
        const mx = (x1 + x2) / 2;
        d = `M${x1} ${y1} H${mx} V${y2} H${x2}`;
        n = [x1 + 8, y1 - 5];
        eins = [x2 - 14, y2 - 5];
      } else {
        const x1 = k.x;
        const x2 = z.x + MASS.breite;
        const mx = (x1 + x2) / 2;
        d = `M${x1} ${y1} H${mx} V${y2} H${x2}`;
        n = [x1 - 14, y1 - 5];
        eins = [x2 + 8, y2 - 5];
      }
      linien.push({ von: k.name, nach: z.name, spalte, d, n, eins });
    }

  const breite = spalten.length * MASS.breite + (spalten.length - 1) * MASS.abstandX + 30;
  return { kaesten: [...kaesten.values()], linien, breite, hoehe: gesamtHoehe };
}
